import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function CreateCrawlerLoading() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Create crawler"
                text="Create a crawler to start importing files."
            />
            <div className="grid gap-10">
                <CardSkeleton />
            </div>
        </DashboardShell>
    )
}