import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { exportMessagesSchema } from "@/lib/validations/exportMessages";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";

export const maxDuration = 300;

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
) {
    const body = await req.json();
    const payload = exportMessagesSchema.parse(body)

    if (!(await verifyCurrentUserHasAccessToChatbot(payload.chatbotId))) {
        return new Response(null, { status: 403 })
    }

    const count = await db.chatbotMessagesExport.count({
        where: {
            chatbotId: payload.chatbotId,
            createdAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
        },
    })

    if (count >= 5) {
        return new Response("Can't create more than 5 export a day! Retry in 24 hours.", { status: 400 })
    }

    try {
        const messages = await db.message.findMany({
            where: {
                chatbotId: payload.chatbotId,
                createdAt: {
                    gte: new Date(new Date().getTime() - payload.lastXDays * 24 * 60 * 60 * 1000)
                },
            },
            select: {
                id: true,
                message: true,
                response: true,
                createdAt: true,
                threadId: true,
            },
        })


        const threadIdMessages = [
            messages.reduce((acc, message) => {
                if (!acc[message.threadId]) {
                    acc[message.threadId] = []
                }
                acc[message.threadId].push(message)
                return acc
            }, {})
        ]

        const chatbotName = await db.chatbot.findUnique({
            where: {
                id: payload.chatbotId,
            },
            select: {
                name: true,
            },
        })

        // name file wiht chatbotId and date now
        const blob = await put(
            `export-${chatbotName?.name}-${new Date().getTime()}.json`,
            JSON.stringify(threadIdMessages, null, 2),
            {
                access: 'public',
            }
        )

        await db.chatbotMessagesExport.create({
            data: {
                chatbotId: payload.chatbotId,
                blobDownloadUrl: blob.downloadUrl,
                blobUrl: blob.url,
                lastXDays: payload.lastXDays,
            }
        })

        const responseBody = {
            url: blob.url,
            downloadURL: blob.downloadUrl,
        }

        return new Response(JSON.stringify(responseBody), { status: 200 })
    } catch (error) {
        console.log(error)
        return new Response(null, { status: 500 })
    }
}