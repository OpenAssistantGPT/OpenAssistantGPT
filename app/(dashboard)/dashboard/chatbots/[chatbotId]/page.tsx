"use server"

import { notFound, redirect } from "next/navigation"
import { Chatbot, User } from "@prisma/client"

import { ChatbotForm } from "@/components/chatbot-form"
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
import { MoveToCrawlersButton } from "@/components/move-to-crawlers-button"

interface ChatbotSettingsProps {
    params: { chatbotId: string }
}

async function getChatbotForUser(chatbotId: Chatbot["id"], userId: User["id"]) {
    return await db.chatbot.findFirst({
        where: {
            id: chatbotId,
            userId: userId,
        },
    })
}


export default async function ChatbotPage({ params }: ChatbotSettingsProps) {

    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const chatbot = await getChatbotForUser(params.chatbotId, user.id)

    if (!chatbot) {
        notFound()
    }

    const crawlers = await db.crawler.findMany({
        where: {
            userId: user.id,
        },
    })

    const files = []

    for (const crawler of crawlers) {
        const crawlerFiles = await db.crawlerFile.findMany({
            where: {
                crawlerId: crawler.id,
            }
        })
        files.push(...crawlerFiles)
    }

    return (
        <DashboardShell>
            <DashboardHeader heading="Chatbot" text="Configure your chatbot here">
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
                <ChatbotForm chatbot={chatbot} />
            </div>

            {files?.length ?
                <>
                    <div className="">
                        <div>
                            <p className="text-muted-foreground">
                                Here&apos;s all of your files
                            </p>
                            { /** <DataTable data={files} columns={columns} /> */}
                        </div>
                    </div>
                </>

                : <div className="grid gap-10">
                    <EmptyPlaceholder>
                        <EmptyPlaceholder.Icon name="laptop" />
                        <EmptyPlaceholder.Title>Start crawling now to import files</EmptyPlaceholder.Title>
                        <EmptyPlaceholder.Description>
                            You don&apos;t have any files yet. Start crawling.
                        </EmptyPlaceholder.Description>
                        <MoveToCrawlersButton />
                    </EmptyPlaceholder>
                </div>

            }
        </DashboardShell>
    )
}