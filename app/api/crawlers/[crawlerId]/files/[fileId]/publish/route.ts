import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import OpenAI from "openai"



const routeContextSchema = z.object({
    params: z.object({
        crawlerId: z.string(),
        fileId: z.string(),
    }),
})

async function verifyCurrentUserHasAccessToCrawler(crawlerId: string) {
    const session = await getServerSession(authOptions)

    const count = await db.crawler.count({
        where: {
            userId: session?.user?.id,
            id: crawlerId,
        },
    })

    return count > 0
}

export async function POST(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {
    try {
        const session = await getServerSession(authOptions)

        // Validate the route params.
        const { params } = routeContextSchema.parse(context)

        if (!(await verifyCurrentUserHasAccessToCrawler(params.crawlerId))) {
            return new Response(null, { status: 403 })
        }

        const crawlerFile = await db.crawlerFile.findUnique({
            where: {
                id: params.fileId
            },
            select: {
                blobUrl: true
            }
        })

        if (!crawlerFile) {
            return new Response(null, { status: 404 })
        }

        const openAIConfig = await db.openAIConfig.findUnique({
            select: {
                globalAPIKey: true,
                id: true,
            },
            where: {
                userId: session?.user?.id
            }
        })
        const openai = new OpenAI({
            apiKey: openAIConfig?.globalAPIKey
        })

        const file = await openai.files.create(
            { file: await fetch(crawlerFile.blobUrl), purpose: 'assistants' }
        )

        await db.openAIFile.create({
            data: {
                fileId: params.fileId,
                openAIFileId: file.id
            }
        })

        return new Response(null, { status: 204 })
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 })
        }

        return new Response(null, { status: 500 })
    }
}