import { CardSkeleton } from "@/components/card-skeleton"
import { ChatbotCreateButton } from "@/components/chatbot-create-button"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
    return (
        <DashboardShell>
            <DashboardHeader heading="Dashboard" text="Welcome to Your Chatbot Dashboard">
                <ChatbotCreateButton />
            </DashboardHeader>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
        </DashboardShell>
    )
}