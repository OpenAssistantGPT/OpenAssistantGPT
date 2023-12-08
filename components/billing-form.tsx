"use client"

import { useState } from "react"

import { UserSubscriptionPlan } from "@/types"
import { cn } from "@/lib/utils"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { Button, buttonVariants } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { freePlan, basicPlan, hobbyPlan, proPlan } from "@/config/subscriptions"

interface BillingFormProps extends React.HTMLAttributes<HTMLFormElement> {
    subscriptionPlan: UserSubscriptionPlan & {
        isCanceled: boolean
    }
}
const plans = [freePlan, hobbyPlan, basicPlan, proPlan]

export function BillingForm({
    subscriptionPlan,
    className,
    ...props
}: BillingFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function openSession(priceId: string) {
        setIsLoading(!isLoading)

        // Get a Stripe session URL.
        const response = await fetch("/api/users/stripe",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    priceId: priceId,
                }),
            })

        if (!response?.ok) {
            return toast({
                title: "Something went wrong.",
                description: "Please refresh the page and try again.",
                variant: "destructive",
            })
        }

        // Redirect to the Stripe session.
        // This could be a checkout page for initial upgrade.
        // Or portal to manage existing subscription.
        const session = await response.json()
        if (session) {
            window.location.href = session.url
        }
    }

    return (
        <form className={cn(className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Subscription Plan</CardTitle>
                    <CardDescription>
                        You are currently on the <strong>{subscriptionPlan.name}</strong>{" "}
                        plan.
                    </CardDescription>
                </CardHeader>
                <CardContent>{subscriptionPlan.description}</CardContent>
                <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
                    <button
                        onClick={() => openSession(subscriptionPlan.stripePriceId)}
                        type="submit"
                        className={cn(buttonVariants())}
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {subscriptionPlan.name ? "Manage Subscription" : "Upgrade to PRO"}
                    </button>
                    {subscriptionPlan ? (
                        <p className="rounded-full text-xs font-medium">
                            {subscriptionPlan.isCanceled
                                ? "Your plan will be canceled on "
                                : "Your plan renews on "}
                            {formatDate(subscriptionPlan.stripeCurrentPeriodEnd)}.
                        </p>
                    ) : null}
                </CardFooter>
            </Card>
            <Card className="border-0">
                <div className="flex flex-wrap gap-6 mt-8 md:gap-8">
                    {plans.map((plan) => {
                        if (plan.stripePriceId !== subscriptionPlan.stripePriceId) {
                            console.log(plan)
                            return (
                                <Card key={plan.name}>
                                    <CardHeader>
                                        <CardTitle>{plan.name}</CardTitle>
                                        <CardDescription>${plan.price}/ month</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="mt-4 space-y-2">
                                            <li className="flex items-center">
                                                - {plan.maxChatbots} Chatbots
                                            </li>
                                            <li className="flex items-center">
                                                - {plan.maxCrawlers} Crawlers
                                            </li>
                                            <li className="flex items-center">
                                                - {plan.maxFiles} Files
                                            </li>
                                            {
                                                plan.unlimitedMessages ?
                                                    <li className="flex items-center">
                                                        - Unlimited Messages
                                                    </li>
                                                    :
                                                    <li className="flex items-center">
                                                        - {plan.maxMessagesPerMonth} Messages per month
                                                    </li>
                                            }
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            onClick={() => openSession(plan.stripePriceId)}
                                            type="submit"
                                            className="w-full">
                                            {isLoading && (
                                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Upgrade
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        }
                    }
                    )}
                    <Card key="enterprise">
                        <CardHeader>
                            <CardTitle>Enterprise</CardTitle>
                            <CardDescription>$X/ month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="mt-4 space-y-2">
                                <li className="flex items-center">
                                    - X Chatbots
                                </li>
                                <li className="flex items-center">
                                    - X Crawlers
                                </li>
                                <li className="flex items-center">
                                    -  X Files
                                </li>
                                <li className="flex items-center">
                                    - Unlimited Messages
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full">
                                {isLoading && (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Contact Sales
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </Card>

        </form >
    )
}