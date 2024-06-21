
import { headers } from "next/headers"
import Stripe from "stripe"

import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
    const body = await req.text()
    const signature = headers().get("stripe-signature") as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ""
        )
    } catch (error: any) {
        console.log(error)
        return new Response(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session

    if (event.type === "checkout.session.completed") {
        console.log("checkout.session.completed")
        // Retrieve the subscription details from Stripe.
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )

        // Update the user stripe into in our database.
        // Since this is the initial subscription, we need to update
        // the subscription id and customer id.
        try {

            await db.user.update({
                where: {
                    id: session?.metadata?.userId,
                },
                data: {
                    stripeSubscriptionId: subscription.id,
                    stripeCustomerId: subscription.customer as string,
                    stripePriceId: subscription.items.data[0].price.id,
                    stripeCurrentPeriodEnd: new Date(
                        subscription.current_period_end * 1000
                    ),
                },
            })

        } catch (error) {
            console.log(error)
            return new Response(`Update error session completed`, { status: 400 })
        }
    }

    if (event.type === "customer.subscription.deleted") {
        console.log("customer.subscription.deleted")
        console.log(`deleting subscription: ${session.id}`)
                // Update the user stripe into in our database.
        // Since this is the initial subscription, we need to update
        // the subscription id and customer id.
        try {
            await db.user.update({
                where: {
                    stripeSubscriptionId: session.id as string,
                },
                data: {
                    stripeSubscriptionId: null,
                    stripeCustomerId: null,
                    stripePriceId: null,
                    stripeCurrentPeriodEnd: null,
                    stripeSubscriptionStatus: "canceled",
                },
            })

        } catch (error) {
            console.log(error)
            return new Response(`Update error subscription deleted`, { status: 400 })
        }
    }

    if (event.type === "invoice.payment_succeeded") {
        console.log("invoice.payment_succeeded")
        // Retrieve the subscription details from Stripe.
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )

        // Update the price id and set the new period end.
        try {
            console.log(subscription)

            await db.user.update({
                where: {
                    stripeSubscriptionId: subscription.id,
                },
                data: {
                    stripePriceId: subscription.items.data[0].price.id,
                    stripeCurrentPeriodEnd: new Date(
                        subscription.current_period_end * 1000
                    ),
                },
            })

        } catch (error) {
            console.log(error)
            return new Response(`Update error payment succeeded`, { status: 400 })
        }
    }

    return new Response(null, { status: 200 })
}