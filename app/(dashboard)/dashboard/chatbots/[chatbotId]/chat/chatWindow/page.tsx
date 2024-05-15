import { notFound } from "next/navigation"
import { Chat } from "@/components/chat"
import { Chatbot } from "@prisma/client"
import { db } from "@/lib/db"


interface ChatbotSettingsProps {
    params: { chatbotId: string, defaultMessage: string, withExitX: boolean }
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

    console.log(params)

    return (
        <Chat chatbot={chatbot} withExitX={params.withExitX} defaultMessage={params.defaultMessage || ""}></Chat>
    )
}