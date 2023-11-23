
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { CrawlerCreateButton } from "@/components/crawler-create-button"
import { db } from "@/lib/db"
import { CrawlerItem } from "@/components/crawler-item"


export const metadata = {
  title: "Crawlers settings",
  description: "Manage your crawlers and crawling configuration.",
}

export default async function CrawlersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const crawlers = await await db.crawler.findMany({
    where: {
      userId: user.id,
    },
  })

  console.log(crawlers)

  return (
    <DashboardShell>
      <DashboardHeader heading="Crawlers" text="Manage your crawlers and crawling configuration.">
        <CrawlerCreateButton />
      </DashboardHeader>
      <div>
        {crawlers?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {crawlers.map((crawler: any) => (
              <CrawlerItem key={crawler.id} crawler={crawler} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No crawler created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any crawler yet. Start importing content.
            </EmptyPlaceholder.Description>
            <CrawlerCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell >
  )
}