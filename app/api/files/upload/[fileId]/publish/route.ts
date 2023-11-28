import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import OpenAI from "openai"



const routeContextSchema = z.object({
    params: z.object({
        fileId: z.string(),
    }),
})



export async function POST(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {
    try {

        const session = await getServerSession(authOptions)

        if (!session) {
            return new Response("Unauthorized", { status: 403 })
        }

        // Validate the route params.
        const { params } = routeContextSchema.parse(context)

        const uploadedFile = await db.uploadFile.findUnique({
            where: {
                id: params.fileId
            },
            select: {
                blobUrl: true
            }
        })

        if (!uploadedFile) {
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
            { file: await fetch(uploadedFile.blobUrl), purpose: 'assistants' }
        )

        console.log(file)

        await db.openAIFile.create({
            data: {
                uploadFileId: params.fileId,
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