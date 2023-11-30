import { db } from "@/lib/db"
import OpenAI from "openai"

import { z } from "zod"
import { sleep } from "@/lib/utils";
import { chatSchema } from "@/lib/validations/chat";


export const maxDuration = 120;


export async function POST(req: Request) {
    try {
        const body = await req.json()
        const payload = chatSchema.parse(body)

        const chatbot = await db.chatbot.findUnique({
            select: {
                id: true,
                openaiKey: true,
                openaiId: true,
            },
            where: {
                id: payload.chatbotId,
            },
        })

        if (!chatbot) {
            return new Response(null, { status: 404 })
        }

        const openai = new OpenAI({
            apiKey: chatbot.openaiKey
        })


        const run = await openai.beta.threads.createAndRun(
            {
                assistant_id: chatbot.openaiId,
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
        let lastmessageId = undefined
        for (const message of result.data) {
            if (message.type === "message_creation") {
                lastmessageId = message
            }
        }

        // get message from id
        const message = await openai.beta.threads.messages.retrieve(run.thread_id, lastmessageId!.step_details.message_creation.message_id)
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
