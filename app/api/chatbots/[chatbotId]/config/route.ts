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
                displayBranding: true,
                chatTitle: true,
                chatMessagePlaceHolder: true,
                bubbleColor: true,
                bubbleTextColor: true,
                chatHeaderBackgroundColor: true,
                chatHeaderTextColor: true,
                chatbotReplyBackgroundColor: true,
                chatbotReplyTextColor: true,
                userReplyBackgroundColor: true,
                userReplyTextColor: true,
                inquiryEnabled: true,
                inquiryLinkText: true,
                inquiryTitle: true,
                inquirySubtitle: true,
                inquiryMessageLabel: true,
                inquiryEmailLabel: true,
                inquirySendButtonText: true,
                inquiryAutomaticReplyText: true,
                inquiryDisplayLinkAfterXMessage: true,
                chatbotLogoURL: true,
                chatFileAttachementEnabled: true,
            },
            where: {
                id: params.chatbotId,
            },
        })

        return new Response(JSON.stringify(chatbot))
    } catch (error) {
        console.log(error)
        return new Response(null, { status: 500 })
    }
}