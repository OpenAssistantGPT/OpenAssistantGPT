import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import OpenAI from "openai"
import { getServerSession } from "next-auth";
import { z } from "zod"

async function verifyCurrentUserHasAccessToChatbot(chatbotId: string) {
    const session = await getServerSession(authOptions)

    const count = await db.chatbot.count({
        where: {
            id: chatbotId,
            userId: session?.user?.id,
        }
    })

    return count > 0
}


const routeContextSchema = z.object({
    params: z.object({
        chatbotId: z.string(),
    }),
})


export async function POST(req: Request, context: z.infer<typeof routeContextSchema>) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new Response("Unauthorized", { status: 403 })
    }

    const { params } = routeContextSchema.parse(context)
    try {
        const count = verifyCurrentUserHasAccessToChatbot(params.chatbotId)
        if (!count) {
            return new Response(null, { status: 403 })
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

        const chatbot = await db.chatbot.findUnique({
            select: {
                id: true,
                name: true,
                prompt: true,
                model: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                ChatbotFiles: {
                    select: {
                        id: true,
                        crawlerFile: {
                            select: {
                                id: true,
                                OpenAIFile: {
                                    select: {
                                        id: true,
                                        openAIFileId: true,
                                    }
                                }
                            }
                        }
                    }

                }
            },
            where: {
                id: params.chatbotId,
            },
        })

        // if chatbot already deployed, delete it in openai
        const openAIChatbot = await db.openAIChatbot.findUnique({
            select: {
                id: true,
                openAIChatbotId: true,
            },
            where: {
                chatbotId: params.chatbotId,
            },
        })
        console.log(openAIChatbot)

        if (openAIChatbot) {
            await openai.beta.assistants.del(openAIChatbot.openAIChatbotId)
            await db.openAIChatbot.delete({
                where: {
                    id: openAIChatbot.id,
                }
            })
        }

        const openAIFileslist = chatbot?.ChatbotFiles.map((chatbotFile) => {
            return chatbotFile.crawlerFile.OpenAIFile.map((openAIFile) => {
                return openAIFile.openAIFileId
            })
        })

        const createdChatbot = await openai.beta.assistants.create({
            name: chatbot?.name,
            instructions: chatbot?.prompt,
            model: chatbot?.model.name || '',
            tools: [{ type: "retrieval" }],
            file_ids: openAIFileslist?.flat() || []
        })

        await db.openAIChatbot.create({
            data: {
                chatbotId: params.chatbotId,
                openAIChatbotId: createdChatbot.id,
            }
        })

        return new Response(null, { status: 201 })
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 })
        }

        return new Response(null, { status: 500 })
    }
}
