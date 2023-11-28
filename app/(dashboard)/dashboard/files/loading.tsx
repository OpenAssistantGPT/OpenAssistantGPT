import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function FilesLoading() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Files"
                text="List of all of your imported and crawled files."
            />
            <div className="grid gap-10">
                <CardSkeleton />
            </div>
        </DashboardShell>
    )
}