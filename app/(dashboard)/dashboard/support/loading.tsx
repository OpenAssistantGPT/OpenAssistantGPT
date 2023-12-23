import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function Loading() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Support"
                text="Welcome to Our Support Page."
            />
            <div className="grid gap-10">
                <CardSkeleton />
            </div>
        </DashboardShell>
    )
}