import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function MessagesLoading() {
    return (
        <DashboardShell>
            <DashboardHeader heading="Messages" text="Comprehensive Log of Messages Received by Your Chatbots">
            </DashboardHeader>
            <CardSkeleton />
        </DashboardShell>
    )
}