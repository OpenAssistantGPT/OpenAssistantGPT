import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function CrawlingLoading() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Crawling"
                text="Start crawling to import files."
            />
            <div className="grid gap-10">
                <CardSkeleton />
            </div>
        </DashboardShell>
    )
}