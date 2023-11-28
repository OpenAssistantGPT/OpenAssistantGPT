import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export const metadata = {
    title: "Pricing",
}

export default function PricingPage() {
    return (
        <section className="container flex flex-col  gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
            <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
                <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                    Simple, transparent pricing
                </h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                    Unlock all features including unlimited posts for your blog.
                </p>
            </div>
            <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
                <div className="grid gap-6">
                    <h3 className="text-xl font-bold sm:text-2xl">
                        What&apos;s included in the FREE plan
                    </h3>
                    <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> 1 Chatbot
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> 1 Crawler
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> 2 Files
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> 30 messages
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> Dashboard Analytics
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> Support
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col gap-4 text-center">
                    <div>
                        <h4 className="text-7xl font-bold">$0</h4>
                        <p className="text-sm font-medium text-muted-foreground">
                            Billed Monthly
                        </p>
                    </div>
                    <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
                        Get Started
                    </Link>
                </div>
            </div>
            <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
                <div className="grid gap-6">
                    <h3 className="text-xl font-bold sm:text-2xl">
                        What&apos;s included in the Basic plan
                    </h3>
                    <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> 3 Bots
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> 5 Crawlers
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> 9 Files
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> Unlimited messages
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> Dashboard Analytics
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> Premium Support
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col gap-4 text-center">
                    <div>
                        <h4 className="text-7xl font-bold">$9</h4>
                        <p className="text-sm font-medium text-muted-foreground">
                            Billed Monthly
                        </p>
                    </div>
                    <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
                        Get Started
                    </Link>
                </div>
            </div>
            <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
                <div className="grid gap-6">
                    <h3 className="text-xl font-bold sm:text-2xl">
                        What&apos;s included in the PRO plan
                    </h3>
                    <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> 9 Bots
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> 12 Crawlers
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> Unlimited messages
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> 26 Files
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> Premium Support
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col gap-4 text-center">
                    <div>
                        <h4 className="text-7xl font-bold">$27</h4>
                        <p className="text-sm font-medium text-muted-foreground">
                            Billed Monthly
                        </p>
                    </div>
                    <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
                        Get Started
                    </Link>
                </div>
            </div>
            <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
                <div className="grid gap-6">
                    <h3 className="text-xl font-bold sm:text-2xl">
                        What&apos;s included in the ENTERPRISE plan
                    </h3>
                    <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> X Bots
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> X Crawlers
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> Unlimited messages
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> X Files
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4" /> Premium Support
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col gap-4 text-center">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Contact us for more information!
                        </p>
                    </div>
                    <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
                        Get Started
                    </Link>
                </div>
            </div>
        </section>
    )
}