import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import OpenAI from "openai"
import { getServerSession } from "next-auth";

import { z } from "zod"
import { sleep } from "@/lib/utils";
import { messageSchema } from "@/lib/validations/message";

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
        const body = await req.json()
        const payload = messageSchema.parse(body)

        const openAIConfig = await db.openAIConfig.findUnique({
            select: {
                globalAPIKey: true,
                id: true,
            },
            where: {
                userId: session?.user?.id
            }
        })

        //const chatbot = await db.chatbot.findUnique({
        //    select: {
        //        id: true,
        //        name: true,
        //        prompt: true,
        //        openaiKey: true,
        //    },
        //    where: {
        //        id: params.chatbotId,
        //    },
        //})

        const openai = new OpenAI({
            // TODO chatbot?.openaiKey ||
            apiKey: openAIConfig?.globalAPIKey
        })

        const openAIChatbot = await db.openAIChatbot.findUnique({
            select: {
                id: true,
                openAIChatbotId: true,
            },
            where: {
                chatbotId: params.chatbotId,
            },
        })


        const run = await openai.beta.threads.createAndRun(
            {
                assistant_id: openAIChatbot?.openAIChatbotId || "",
                thread: {
                    messages: [
                        { role: "user", content: payload.message },
                    ]
                }
            }
        )
        // wait for the thread to finish
        let retrieval = await openai.beta.threads.runs.retrieve(run.thread_id, run.id)
        // do polling until message status is completed
        let pollCount = 0
        while (retrieval.status !== "completed") {
            retrieval = await openai.beta.threads.runs.retrieve(run.thread_id, run.id)
            console.log(`polling ${pollCount++}`)
            await sleep(1000)
        }

        // GET openai message
        const result = await openai.beta.threads.runs.steps.list(run.thread_id, run.id)
        // get last id from data list
        let lastmessageId = ''
        for (const message of result.data) {
            if (message.type === "message_creation") {
                lastmessageId = message
            }
        }

        // get message from id
        const message = await openai.beta.threads.messages.retrieve(run.thread_id, lastmessageId.step_details.message_creation.message_id)
        console.log(message.content[0].text)

        return new Response(JSON.stringify(message.content[0].text), { status: 200 })
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 })
        }

        return new Response(null, { status: 500 })
    }
}
