
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { ChatbotCreateButton } from "@/components/chatbot-create-button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
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
      model: {
        select: {
          id: true,
          name: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const crawlers = await db.crawler.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      crawlerFile: {
        select: {
          id: true,
        }
      }
    },
    where: {
      userId: user.id,
    },
  })

  let totalCrawlerFiles = 0
  for (const crawler of crawlers) {
    totalCrawlerFiles += crawler.crawlerFile.length
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Welcome to your chatbot dashboard">
        <ChatbotCreateButton />
      </DashboardHeader>
      <div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Number of chatbot
              </CardTitle>
              <Icons.bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bots.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Number of crawlers
              </CardTitle>
              <Icons.post className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{crawlers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Number of files
              </CardTitle>
              <Icons.folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCrawlerFiles}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell >
  )
}