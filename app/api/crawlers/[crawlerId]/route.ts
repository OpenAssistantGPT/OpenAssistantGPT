
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { del } from '@vercel/blob';

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { crawlerSchema } from "@/lib/validations/crawler"

const routeContextSchema = z.object({
    params: z.object({
        crawlerId: z.string(),
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

export async function DELETE(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {
    try {
        // Validate the route params.
        const { params } = routeContextSchema.parse(context)

        if (!(await verifyCurrentUserHasAccessToCrawler(params.crawlerId))) {
            return new Response(null, { status: 403 })
        }

        const crawlerFiles = await db.file.findMany({
            where: {
                crawlerId: params.crawlerId
            }
        })

        for (const crawlerFile of crawlerFiles) {
            await del(crawlerFile.blobUrl)
        }


        // Delete the crawler.
        await db.crawler.delete({
            where: {
                id: params.crawlerId as string,
            },
        })

        return new Response(null, { status: 204 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 })
        }

        return new Response(null, { status: 500 })
    }
}


export async function PATCH(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {
    try {
        // Validate the route context.
        const { params } = routeContextSchema.parse(context)

        if (!(await verifyCurrentUserHasAccessToCrawler(params.crawlerId))) {
            return new Response(null, { status: 403 })
        }

        const body = await req.json()
        const payload = crawlerSchema.parse(body)

        await db.crawler.update({
            where: {
                id: params.crawlerId,
            },
            data: {
                name: payload.name,
                crawlUrl: payload.crawlUrl,
                selector: payload.selector,
                urlMatch: payload.urlMatch,
            },
        })

        return new Response(null, { status: 200 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 })
        }

        return new Response(null, { status: 500 })
    }
}