import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

const routeContextSchema = z.object({
    params: z.object({
        chatbotId: z.string(),
    }),
})

const crawlerCreateSchema = z.object({
    files: z.string().array(),
})


async function verifyCurrentUserHasAccessToChatbot(chatbotId: string) {
    const session = await getServerSession(authOptions)

    const count = await db.chatbot.count({
        where: {
            id: chatbotId,
            userId: session?.user?.id,
        },
    })

    return count > 0
}

export async function POST(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {

    const { params } = routeContextSchema.parse(context)
    try {
        const count = verifyCurrentUserHasAccessToChatbot(params.chatbotId)
        if (!count) {
            return new Response(null, { status: 403 })
        }

        const session = await getServerSession(authOptions)

        const json = await req.json()
        const body = crawlerCreateSchema.parse(json)

        const filesCount = await db.crawlerFile.count({
            where: {
                id: {
                    in: body.files
                },
                crawler: {
                    userId: session?.user?.id
                }
            }
        })

        if (filesCount !== body.files.length) {
            return new Response(null, { status: 403 })
        }

        const chatbot = await db.chatbot.update({
            where: {
                id: params.chatbotId
            },
            data: {
                crawlerFile: {
                    connect: body.files.map((fileId: string) => {
                        return {
                            id: fileId
                        }
                    })
                }
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                crawlerFile: {
                    select: {
                        id: true,
                        name: true,
                        blobUrl: true,
                        createdAt: true,
                    }
                },
            },
        })


        return new Response(JSON.stringify({ chatbot }))
    } catch (error) {
        console.log(error)
        return new Response(null, { status: 500 })
    }
}