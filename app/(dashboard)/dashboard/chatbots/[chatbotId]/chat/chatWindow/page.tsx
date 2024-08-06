import { notFound } from "next/navigation"
import { Chat, ClientSideChatbotProps } from "@/components/chat-sdk"
import { Chatbot } from "@prisma/client"
import { db } from "@/lib/db"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { getClientIP } from "@/lib/getIP"
import { Icons } from "@/components/icons"

var ipRangeCheck = require("ip-range-check");


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

    let accessDenied = false

    if (!chatbot) {
        notFound()
    }

    // validate ip restrictions
    const ip = getClientIP()
    if (!chatbot?.allowEveryone) {

        if (!ipRangeCheck(ip, chatbot?.allowedIpRanges || [])) {
            accessDenied = true
        }
    }

    // validate is ip is banned 
    if(ipRangeCheck(ip, chatbot.bannedIps)) {
        accessDenied = true
    }

    //const plan = await getUserSubscriptionPlan(chatbot.userId)
    
    //if (chatbot.displayBranding === false && plan?.brandingCustomization === false) {
    //    chatbot.displayBranding = true
    //}

    //if (chatbot.chatFileAttachementEnabled && plan?.chatFileAttachments === false) {
    //    chatbot.chatFileAttachementEnabled = false
    //}

    //if (chatbot.chatbotLogoURL !== '' && plan?.basicCustomization === false) {
    //    chatbot.chatbotLogoURL = null
    //}

    if (accessDenied) {
        return (
            <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
              <Icons.lock className="mx-auto h-12 w-12 text-primary" />
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Access Denied</h1>
              <p className="mt-4 text-muted-foreground">
                You don&apos;t have permission to access this page. Please contact an administrator if you believe this is an
                error.
              </p>
            </div>
          </div>
        )
    }
    
    const clientSideChatbot: ClientSideChatbotProps = {
        id: chatbot.id,
        name: chatbot.name,
        userId: chatbot.userId,
        openaiId: chatbot.openaiId,
        createdAt: chatbot.createdAt,
        welcomeMessage: chatbot.welcomeMessage,
        chatbotErrorMessage: chatbot.chatbotErrorMessage,
        isImported: chatbot.isImported,
        chatTitle: chatbot.chatTitle,
        chatbotLogoURL: chatbot.chatbotLogoURL || '',
        chatMessagePlaceHolder: chatbot.chatMessagePlaceHolder,
        rightToLeftLanguage: chatbot.rightToLeftLanguage,
        bubbleColor: chatbot.bubbleColor,
        bubbleTextColor: chatbot.bubbleTextColor,
        chatHeaderBackgroundColor: chatbot.chatHeaderBackgroundColor,
        chatHeaderTextColor: chatbot.chatHeaderTextColor,
        chatbotReplyBackgroundColor: chatbot.chatbotReplyBackgroundColor,
        chatbotReplyTextColor: chatbot.chatbotReplyTextColor,
        userReplyBackgroundColor: chatbot.userReplyBackgroundColor,
        userReplyTextColor: chatbot.userReplyTextColor,
        chatInputStyle: chatbot.chatInputStyle,
        inquiryEnabled: chatbot.inquiryEnabled,
        inquiryLinkText: chatbot.inquiryLinkText,
        inquiryTitle: chatbot.inquiryTitle,
        inquirySubtitle: chatbot.inquirySubtitle,
        inquiryEmailLabel: chatbot.inquiryEmailLabel,
        inquiryMessageLabel: chatbot.inquiryMessageLabel,
        inquirySendButtonText: chatbot.inquirySendButtonText,
        inquiryAutomaticReplyText: chatbot.inquiryAutomaticReplyText,
        inquiryDisplayLinkAfterXMessage: chatbot.inquiryDisplayLinkAfterXMessage,
        chatHistoryEnabled: chatbot.chatHistoryEnabled,
        displayBranding: chatbot.displayBranding,
        chatFileAttachementEnabled: chatbot.chatFileAttachementEnabled,
        bannedIps: chatbot.bannedIps,
        allowEveryone: chatbot.allowEveryone,
        allowedIpRanges: chatbot.allowedIpRanges,
    }

    return (
        <Chat chatbot={clientSideChatbot} withExitX={params.withExitX} defaultMessage={params.defaultMessage || ""} clientSidePrompt={params.clientSidePrompt || ""}></Chat>
    )
}