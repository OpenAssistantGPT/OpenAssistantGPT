
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { BillingForm } from "@/components/billing-form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { siteConfig } from "@/config/site"

export const metadata = {
    title: `${siteConfig.name} - Billing`,
    description: "Manage billing and your subscription plan.",
}

export default async function BillingPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Billing"
                text="Manage billing and your subscription plan."
            />
            <div className="grid gap-8">

                <BillingForm
                />
            </div>
        </DashboardShell>
    )
}