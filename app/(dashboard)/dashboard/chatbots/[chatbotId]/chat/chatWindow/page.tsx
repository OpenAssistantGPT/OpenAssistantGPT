import { notFound } from "next/navigation"
import { Chat } from "@/components/chat"
import { Chatbot } from "@prisma/client"
import { db } from "@/lib/db"
import { getUserSubscriptionPlan } from "@/lib/subscription"


interface ChatbotSettingsProps {
    params: { chatbotId: string, defaultMessage: string, withExitX: boolean, clientSidePrompt: string }
}

async function getChatbotForUser(chatbotId: Chatbot["id"]) {
    return await db.chatbot.findFirst({
        where: {
            id: chatbotId,
        },
    })
}

export default async function ChatbotPage({ params }: ChatbotSettingsProps) {

    const chatbot = await getChatbotForUser(params.chatbotId)

    if (!chatbot) {
        notFound()
    }

    const plan = await getUserSubscriptionPlan(chatbot.userId)
    
    if (chatbot.displayBranding === false && plan?.brandingCustomization === false) {
        chatbot.displayBranding = true
    }

    if (chatbot.chatFileAttachementEnabled && plan?.chatFileAttachments === false) {
        chatbot.chatFileAttachementEnabled = false
    }

    if (chatbot.chatbotLogoURL !== '' && plan?.basicCustomization === false) {
        chatbot.chatbotLogoURL = null
    }

    return (
        <Chat chatbot={chatbot} withExitX={params.withExitX} defaultMessage={params.defaultMessage || ""} clientSidePrompt={params.clientSidePrompt || ""}></Chat>
    )
}