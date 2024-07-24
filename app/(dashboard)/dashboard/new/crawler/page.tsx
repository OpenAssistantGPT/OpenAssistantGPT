
import { redirect } from "next/navigation"

import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { NewCrawlerForm } from "@/components/new-crawler-form"


export default async function CrawlerCreatePage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    return (
        <DashboardShell>
            <DashboardHeader heading="Create your crawler" text="Create a crawler to start importing files.">
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
                <NewCrawlerForm />
            </div>
        </DashboardShell>
    )
}