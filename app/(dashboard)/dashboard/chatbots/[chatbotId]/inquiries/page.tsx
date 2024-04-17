import { getCurrentUser } from "@/lib/session"
import { notFound, redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Chatbot, User } from "@prisma/client"
import { db } from "@/lib/db"
import Link from "next/link"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Inquiries } from "@/components/inquiries"
import { InquiryMessages } from "@/types"

interface ChatbotSettingsProps {
    params: { chatbotId: string }
}

async function getChatbotForUser(chatbotId: Chatbot["id"], userId: User["id"]) {
    return await db.chatbot.findFirst({
        where: {
            id: chatbotId,
            userId: userId,
        },
    })
}

export default async function UserInquiryPage({ params }: ChatbotSettingsProps) {

    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const chatbot = await getChatbotForUser(params.chatbotId, user.id)

    if (!chatbot) {
        notFound()
    }

    // select the messages with the thread id
    const inquiries = await db.clientInquiries.findMany({
        select: {
            id: true,
            email: true,
            threadId: true,
            inquiry: true,
            createdAt: true,
            chatbotId: true,
            deletedAt: true
        },
        where: {
            chatbotId: chatbot.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    // for each inquiry get the messages thread using threadid
    const inquiriesWithMessages: InquiryMessages[] = await Promise.all(
        inquiries.map(async (inquiry) => {
            const messages = await db.message.findMany({
                where: {
                    threadId: inquiry.threadId,
                    chatbotId: inquiry.chatbotId
                }
            })
            return {
                ...inquiry,
                messages
            }
        }
        )
    )

    return (
        <DashboardShell>
            <DashboardHeader heading="User Inquiries" text="All the users that contacted you using your chatbot">
                <Link
                    href={`/dashboard/chatbots`}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "md:left-8 md:top-8"
                    )}
                >
                    <>
                        <Icons.chevronLeft className="mr-2 h-4 w-4" />
                        Back
                    </>
                </Link>
            </DashboardHeader>
            <Inquiries inquiries={inquiriesWithMessages} />
        </DashboardShell >
    )
}