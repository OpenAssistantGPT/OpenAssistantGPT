
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export const metadata = {
    title: "Crawling settings",
    description: "Manage your crawlers and crawling configuration.",
}

export default async function CrawlingPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Crawling"
                text="Manage your crawlers and crawling configuration."
            />
            <div className="grid gap-10">
            </div>
        </DashboardShell>
    )
}