import { redirect } from "next/navigation"

import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { siteConfig } from "@/config/site"
import { DataTable } from "./data-table"
import { columns } from "./columns"

export const metadata = {
    title: `${siteConfig.name} - Messages`,
}

export default async function MessagesPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const messages = await db.message.findMany({
        select: {
            id: true,
            message: true,
            createdAt: true,
            chatbotId: true,
        },
        where: {
            userId: user.id,
            createdAt: {
                gt: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
            },
        },
    })
    messages.reverse()

    return (
        <DashboardShell>
            <DashboardHeader heading="Messages" text="Comprehensive Log of Messages Received by Your Chatbots">
            </DashboardHeader>
            <DataTable columns={columns} data={messages} />
        </DashboardShell>
    )
}