import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function CreateExportLoading() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Export Messages"
                text="Create an export of your chatbot messages."
            />
            <div className="grid gap-10">
                <CardSkeleton />
            </div>
        </DashboardShell>
    )
}