
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { ChatbotCreateButton } from "@/components/chatbot-create-button"
import { ChatbotItem } from "@/components/chatbot-item"
import { siteConfig } from "@/config/site"
import { UserCreateButton } from "@/components/user-create-button"

export const metadata = {
  title: `${siteConfig.name} - Chatbots`,
}

export default async function ChatbotsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const bots: any[] = await db.chatbot.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      openaiId: true,
      model: {
        select: {
          id: true,
          name: true,
        }
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Users" text="Create and manage your users.">
        <UserCreateButton />
      </DashboardHeader>
      <div>
        {bots?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {bots.map((bot) => (
              <ChatbotItem key={bot.id} chatbot={bot} model={bot.model} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="bot" />
            <EmptyPlaceholder.Title>No user created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any user yet.
            </EmptyPlaceholder.Description>
            <ChatbotCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell >
  )
}