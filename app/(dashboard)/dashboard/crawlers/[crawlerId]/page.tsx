
import { notFound, redirect } from "next/navigation"
import { Crawler, User } from "@prisma/client"

import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { CrawlerForm } from "@/components/crawler-form"

interface CrawlerSettingsProps {
    params: { crawlerId: string }
}

async function getCrawlerForUser(crawlerId: Crawler["id"], userId: User["id"]) {
    return await db.crawler.findFirst({
        where: {
            id: crawlerId,
            userId: userId,
        },
    })
}


export default async function CrawlerSettingsPage({ params }: CrawlerSettingsProps) {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const crawler = await getCrawlerForUser(params.crawlerId, user.id)

    if (!crawler) {
        notFound()
    }

    return (
        <DashboardShell>
            <DashboardHeader heading="Settings" text="Manage your crawling settings">
                <Link
                    href="/dashboard/crawlers"
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "md:left-8 md:top-8"
                    )}
                >
                    <>
                        <Icons.chevronLeft className="mr-2 h-4 w-4" />
                        Back
                    </>
                </Link>
            </DashboardHeader>
            <div className="grid gap-10">
                <CrawlerForm crawler={{
                    id: crawler.id, name: crawler.name, crawlUrl: crawler.crawlUrl, selector: crawler.selector, urlMatch: crawler.urlMatch
                }} />
            </div>
        </DashboardShell>
    )
}