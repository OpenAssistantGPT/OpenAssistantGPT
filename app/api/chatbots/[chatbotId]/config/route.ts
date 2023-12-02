import { db } from "@/lib/db";
import { z } from "zod";

const routeContextSchema = z.object({
    params: z.object({
        chatbotId: z.string(),
    }),
})

export async function GET(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {

    const { params } = routeContextSchema.parse(context)

    try {
        const chatbot = await db.chatbot.findUnique({
            select: {
                id: true,
                welcomeMessage: true,
            },
            where: {
                id: params.chatbotId,
            },
        })

        return new Response(JSON.stringify(chatbot))
    } catch (error) {
        return new Response(null, { status: 500 })
    }
}