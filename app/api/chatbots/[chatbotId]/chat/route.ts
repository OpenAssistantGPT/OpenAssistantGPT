import { db } from "@/lib/db"
import OpenAI from "openai"

import { z } from "zod"
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { experimental_AssistantResponse } from 'ai';
import { MessageContentText } from 'openai/resources/beta/threads/messages/messages';

export const maxDuration = 300;

const routeContextSchema = z.object({
    params: z.object({
        chatbotId: z.string(),
    }),
})

export async function OPTIONS(req: Request) {
    return new Response('Ok', { status: 200 })
}

export async function POST(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {
    try {
        const { params } = routeContextSchema.parse(context)

        const chatbot = await db.chatbot.findUnique({
            select: {
                id: true,
                openaiKey: true,
                userId: true,
                openaiId: true,
            },
            where: {
                id: params.chatbotId,
            },
        })

        if (!chatbot) {
            return new Response(null, { status: 404 })
        }

        const openai = new OpenAI({
            apiKey: chatbot.openaiKey
        })

        const input: {
            threadId: string | null;
            message: string;
        } = await req.json();

        // Create a thread if needed
        const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

        // Add a message to the thread
        const createdMessage = await openai.beta.threads.messages.create(threadId, {
            role: 'user',
            content: input.message,
        });

        return experimental_AssistantResponse(
            { threadId, messageId: createdMessage.id },
            async ({ threadId, sendMessage, sendDataMessage }) => {

                const plan = await getUserSubscriptionPlan(chatbot.userId)
                if (plan.unlimitedMessages === false) {
                    const messageCount = await db.message.count({
                        where: {
                            userId: chatbot.userId,
                            createdAt: {
                                gte: new Date(new Date().setDate(new Date().getDate() - 30))
                            }
                        }
                    })
                    console.log(`Message count: ${messageCount}`)
                    if (messageCount >= plan.maxMessagesPerMonth!) {
                        console.log(`Reached message limit ${chatbot.userId}`)
                        sendMessage({
                            id: "end",
                            role: 'assistant',
                            content: [{ type: 'text', text: { value: "You have reached your monthly message limit. Upgrade your plan to continue using your chatbot." } }]
                        });
                        return;
                    }
                }

                // Run the assistant on the thread
                const run = await openai.beta.threads.runs.create(threadId, {
                    assistant_id: chatbot.openaiId,
                });

                async function waitForRun(run: OpenAI.Beta.Threads.Runs.Run) {
                    // Poll for status change
                    while (run.status === 'queued' || run.status === 'in_progress') {
                        // delay for 500ms:
                        await new Promise(resolve => setTimeout(resolve, 500));

                        run = await openai.beta.threads.runs.retrieve(threadId!, run.id);
                    }

                    // Check the run status
                    if (
                        run.status === 'cancelled' ||
                        run.status === 'cancelling' ||
                        run.status === 'failed' ||
                        run.status === 'expired'
                    ) {
                        throw new Error(run.status);
                    }
                }

                await waitForRun(run);

                // Get new thread messages (after our message)
                const responseMessages = (
                    await openai.beta.threads.messages.list(threadId, {
                        after: createdMessage.id,
                        order: 'asc',
                    })
                ).data;

                // Send the messages
                for (const message of responseMessages) {
                    await db.message.create({
                        data: {
                            chatbotId: params.chatbotId,
                            userId: chatbot.userId,
                            message: input.message,
                            response: message.content[0].text.value,
                            from: req.headers.get("origin") || "unknown",
                        }
                    })
                    sendMessage({
                        id: message.id,
                        role: 'assistant',
                        content: message.content.filter(
                            content => content.type === 'text',
                        ) as Array<MessageContentText>,
                    });
                }
            },
        );

    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 })
        }

        return new Response(null, { status: 500 })
    }
}
