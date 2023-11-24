
import { redirect } from "next/navigation"

import { NewChatbotForm } from "@/components/new-chatbot-form"

import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { db } from "@/lib/db"


export default async function ChatbotCreatePage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const models = await db.chatbotModel.findMany()

    return (
        <DashboardShell>
            <DashboardHeader heading="Create your chatbot" text="Create your chatbot and start talking with him.">
                <Link
                    href="/dashboard"
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
                <NewChatbotForm />
            </div>
        </DashboardShell>
    )
}