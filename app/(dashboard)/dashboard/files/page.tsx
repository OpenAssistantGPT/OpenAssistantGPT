
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
import { CrawlerFileItem } from "@/components/file-items"


export default async function FilePage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const crawlers = await db.crawler.findMany({
        select: {
            id: true,
            name: true,
            createdAt: true,
            crawlerFile: {
                select: {
                    id: true,
                    name: true,
                    blobUrl: true,
                    createdAt: true,
                    crawlerId: true,
                }
            }
        },
        where: {
            userId: user.id,
        },
    })


    return (
        <DashboardShell>
            <DashboardHeader heading="Files" text="List of all of your crawled file">
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
            {crawlers?.length ?
                <>
                    <div className="divide-y divide-border rounded-md border">
                        {crawlers.map((crawler) => (
                            crawler.crawlerFile.map((file) => (
                                <CrawlerFileItem file={file} key={file.id} />
                            ))
                        ))
                        }
                    </div>
                </>

                : <div className="grid gap-10">
                    <EmptyPlaceholder>
                        <EmptyPlaceholder.Icon name="laptop" />
                        <EmptyPlaceholder.Title>Start crawling now to import files</EmptyPlaceholder.Title>
                        <EmptyPlaceholder.Description>
                            You don&apos;t have any files yet. Start crawling.
                        </EmptyPlaceholder.Description>
                    </EmptyPlaceholder>
                </div>

            }
        </DashboardShell>
    )
}