import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function CrawlersSettingsLoading() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Crawlers"
                text="Manage your crawlers and crawling configuration."
            />
            <div className="grid gap-10">
                <CardSkeleton />
            </div>
        </DashboardShell>
    )
}