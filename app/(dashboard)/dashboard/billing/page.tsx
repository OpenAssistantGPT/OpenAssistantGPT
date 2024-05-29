
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { BillingForm } from "@/components/billing-form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { siteConfig } from "@/config/site"
import { stripe } from "@/lib/stripe"
import { getUserSubscriptionPlan } from "@/lib/subscription"

export const metadata = {
    title: `${siteConfig.name} - Billing`,
    description: "Manage billing and your subscription plan.",
}

export default async function BillingPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const subscriptionPlan = await getUserSubscriptionPlan(user.id)

    // If user has a pro plan, check cancel status on Stripe.
    let isCanceled = false
    if (subscriptionPlan.stripeSubscriptionId) {
        const stripePlan = await stripe.subscriptions.retrieve(
            subscriptionPlan.stripeSubscriptionId
        )
        isCanceled = stripePlan.cancel_at_period_end
    }

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Billing"
                text="Manage billing and your subscription plan. For more information about our plans, visit our documentation pricing page or you can ask our chatbot."
            />
            
            <BillingForm
                subscriptionPlan={{
                    ...subscriptionPlan,
                    isCanceled,
                }}
            />
        </DashboardShell>
    )
}