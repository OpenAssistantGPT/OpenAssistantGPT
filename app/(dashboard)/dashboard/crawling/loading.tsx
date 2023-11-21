import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function CrawlingSettingsLoading() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Crawling"
                text="Manage your crawlers and crawling configuration."
            />
            <div className="grid gap-10">
                <CardSkeleton />
            </div>
        </DashboardShell>
    )
}