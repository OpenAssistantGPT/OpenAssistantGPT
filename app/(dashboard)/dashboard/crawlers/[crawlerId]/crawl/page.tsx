
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
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { StartCrawlingButton } from "@/components/start-crawling-button"
import { FileItem } from "@/components/file-items"

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


export default async function CrawlingPage({ params }: CrawlerSettingsProps) {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const crawler = await getCrawlerForUser(params.crawlerId, user.id)

    if (!crawler) {
        notFound()
    }

    const files = await db.file.findMany({
        where: {
            crawlerId: crawler.id,
        },
    })

    return (
        <DashboardShell>
            <DashboardHeader heading="Crawling" text="Start crawling to import files">
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
            {files?.length ?
                <>
                    <div className="divide-y divide-border rounded-md border">
                        {files.map((file) => (
                            <FileItem file={file} key={file.id} />
                        ))}
                    </div>
                    <StartCrawlingButton crawler={crawler} />
                </>

                : <div className="grid gap-10">
                    <EmptyPlaceholder>
                        <EmptyPlaceholder.Icon name="laptop" />
                        <EmptyPlaceholder.Title>Start crawling now to import files</EmptyPlaceholder.Title>
                        <EmptyPlaceholder.Description>
                            You don&apos;t have any files yet. Start crawling.
                        </EmptyPlaceholder.Description>
                        <StartCrawlingButton crawler={crawler} />
                    </EmptyPlaceholder>
                </div>

            }
        </DashboardShell>
    )
}