
import { redirect } from "next/navigation"

import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { NewMessageExportForm } from "@/components/new-message-export"
import { db } from "@/lib/db"


export default async function CreateMessageExportPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const chatbots = await db.chatbot.findMany({
        where: {
            userId: user.id,
        },
        select: {
            id: true,
            name: true,
            openaiId: true,
        },
    })

    return (
        <DashboardShell>
            <DashboardHeader heading="Export Messages" text="Create an export of your chatbot messages.">
                <Link
                    href="/dashboard/exports"
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
                <NewMessageExportForm chatbots={chatbots} />
            </div>
        </DashboardShell>
    )
}