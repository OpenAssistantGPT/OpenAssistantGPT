import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

const routeContextSchema = z.object({
    params: z.object({
        chatbotId: z.string(),
        errorId: z.string(),
    }),
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


export async function DELETE(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {
    const { params } = routeContextSchema.parse(context)

    if (!(await verifyCurrentUserHasAccessToChatbot(params.chatbotId))) {
        return new Response(null, { status: 403 })
    }

    try {
        await db.chatbotErrors.delete({
            where: {
                chatbotId: params.chatbotId,
                id: params.errorId,
            },
        })

        return new Response(null, { status: 201 })
    } catch (error) {
        console.log(error)
        return new Response(null, { status: 500 })
    }
}