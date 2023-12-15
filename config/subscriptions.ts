import { SubscriptionPlan } from "@/types"

export const freePlan: SubscriptionPlan = {
    name: "FREE",
    description: "The FREE plan is limited to 1 chatbot, 1 crawler, 2 files and 20 messages per month.",
    stripePriceId: "",

    maxChatbots: 1,
    maxCrawlers: 1,
    maxFiles: 2,
    unlimitedMessages: false,
    maxMessagesPerMonth: 10,

    price: 0,
}

export const hobbyPlan: SubscriptionPlan = {
    name: "HOBBY",
    description: "The HOBBY plan is limited 1 chatbot, 1 crawler and 2 files and unlimited messages.",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_HOBBY_PRICE_ID || "",

    maxChatbots: 1,
    maxCrawlers: 1,
    maxFiles: 2,
    unlimitedMessages: false,
    maxMessagesPerMonth: 100,

    price: 3,
}

export const basicPlan: SubscriptionPlan = {
    name: "BASIC",
    description: "The BASIC plan has 3 chatbots, 3 crawlers and 6 files and unlimited messages.",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || "",

    maxChatbots: 3,
    maxCrawlers: 3,
    maxFiles: 6,
    unlimitedMessages: true,
    maxMessagesPerMonth: undefined,

    price: 8,
}

export const proPlan: SubscriptionPlan = {
    name: "PRO",
    description: "The PRO plan has 12 chatbots, 12 crawlers and 24 files and unlimited messages.",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "",

    maxChatbots: 12,
    maxCrawlers: 12,
    maxFiles: 24,
    unlimitedMessages: true,
    maxMessagesPerMonth: undefined,

    price: 30,
}