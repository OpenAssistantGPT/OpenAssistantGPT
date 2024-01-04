import { db } from "@/lib/db"
import OpenAI from "openai"

import { z } from "zod"
import { sleep } from "@/lib/utils";
import { chatSchema } from "@/lib/validations/chat";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { experimental_AssistantResponse } from 'ai';
import { MessageContentText } from 'openai/resources/beta/threads/messages/messages';


export const maxDuration = 300;
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

const homeTemperatures = {
    bedroom: 20,
    'home office': 21,
    'living room': 21,
    kitchen: 22,
    bathroom: 23,
};

export async function POST(req: Request) {
    try {
        const body = await req.json()
        console.log(body)
        const payload = chatSchema.parse(body)

        const chatbot = await db.chatbot.findUnique({
            select: {
                id: true,
                openaiKey: true,
                userId: true,
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
                // Run the assistant on the thread
                const run = await openai.beta.threads.runs.create(threadId, {
                    assistant_id:
                        process.env.ASSISTANT_ID ??
                        (() => {
                            throw new Error('ASSISTANT_ID is not set');
                        })(),
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

                    if (run.status === 'requires_action') {
                        if (run.required_action?.type === 'submit_tool_outputs') {
                            const tool_outputs =
                                run.required_action.submit_tool_outputs.tool_calls.map(
                                    toolCall => {
                                        const parameters = JSON.parse(toolCall.function.arguments);

                                        switch (toolCall.function.name) {
                                            case 'getRoomTemperature': {
                                                const temperature =
                                                    homeTemperatures[
                                                    parameters.room as keyof typeof homeTemperatures
                                                    ];

                                                return {
                                                    tool_call_id: toolCall.id,
                                                    output: temperature.toString(),
                                                };
                                            }

                                            case 'setRoomTemperature': {
                                                const oldTemperature =
                                                    homeTemperatures[
                                                    parameters.room as keyof typeof homeTemperatures
                                                    ];

                                                homeTemperatures[
                                                    parameters.room as keyof typeof homeTemperatures
                                                ] = parameters.temperature;

                                                sendDataMessage({
                                                    role: 'data',
                                                    data: {
                                                        oldTemperature,
                                                        newTemperature: parameters.temperature,
                                                        description: `Temperature in ${parameters.room} changed from ${oldTemperature} to ${parameters.temperature}`,
                                                    },
                                                });

                                                return {
                                                    tool_call_id: toolCall.id,
                                                    output: `temperature set successfully`,
                                                };
                                            }

                                            default:
                                                throw new Error(
                                                    `Unknown tool call function: ${toolCall.function.name}`,
                                                );
                                        }
                                    },
                                );

                            run = await openai.beta.threads.runs.submitToolOutputs(
                                threadId!,
                                run.id,
                                { tool_outputs },
                            );

                            await waitForRun(run);
                        }
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
