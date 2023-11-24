import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function CreateChatbotLoading() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Create your chatbot"
                text="Create your chatbot and start talking with him."
            />
            <div className="grid gap-10">
                <CardSkeleton />
            </div>
        </DashboardShell>
    )
}