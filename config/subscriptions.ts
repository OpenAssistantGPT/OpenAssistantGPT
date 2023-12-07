import { SubscriptionPlan } from "@/types"

export const freePlan: SubscriptionPlan = {
    name: "Free",
    description:
        "The free plan is limited 1 chatbot",
    stripePriceId: "",
}

export const proPlan: SubscriptionPlan = {
    name: "PRO",
    description: "The PRO plan has unlimited chatbot.",
    stripePriceId: "price_1OKgFsKS6OWmFI3nAY6ZpjLJ"//env.STRIPE_PRO_MONTHLY_PLAN_ID || "",
}