import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function CreateChatbotLoading() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Create a chatbot"
                text="Create a chatbot."
            />
            <div className="grid gap-10">
                <CardSkeleton />
            </div>
        </DashboardShell>
    )
}