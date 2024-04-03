
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod"
import { getServerSession } from "next-auth";

const routeContextSchema = z.object({
    params: z.object({
        chatbotId: z.string(),
        inquiryId: z.string(),
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
    try {
        const { params } = routeContextSchema.parse(context)

        if (!(await verifyCurrentUserHasAccessToChatbot(params.chatbotId))) {
            return new Response(null, { status: 403 })
        }

        // validate inquiry has the same chatbotId
        const inquiry = await db.clientInquiries.findFirst({
            where: {
                id: params.inquiryId,
                chatbotId: params.chatbotId,
            },
        })

        if (!inquiry) {
            return new Response(null, { status: 404 });
        }

        await db.clientInquiries.update({
            data: {
                deletedAt: new Date(),
            },
            where: {
                id: params.inquiryId,
                chatbotId: params.chatbotId,
            },
        })

        return new Response('deleted', { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(null, { status: 500 });
    }
}
