// @ts-nocheck
// TODO: Fix this when we turn strict mode on.
import { UserSubscriptionPlan } from "@/types"
import { basicPlan, freePlan, hobbyPlan, proPlan } from "@/config/subscriptions"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"

export async function getUserSubscriptionPlan(
    userId: string
): Promise<UserSubscriptionPlan> {
    const user = await db.user.findFirst({
        where: {
            id: userId,
        },
        select: {
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true,
        },
    })

    if (!user) {
        throw new Error("User not found")
    }

    // Check if user is on a pro plan.
    const hasPlan = user.stripePriceId &&
        user.stripeCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now()

    let plan = freePlan

    if (hasPlan) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId)

        if (subscription.plan.nickname === "Pro plan") {
            plan = proPlan
        } else if (subscription.plan.nickname === "Hobby plan") {
            plan = hobbyPlan
        } else if (subscription.plan.nickname === "Basic plan") {
            plan = basicPlan
        }
    }

    return {
        ...plan,
        ...user,
        stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime(),
    }
}