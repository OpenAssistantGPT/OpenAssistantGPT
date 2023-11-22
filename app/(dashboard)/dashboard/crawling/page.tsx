
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { CrawlerCreateButton } from "@/components/crawler-create-button"


export const metadata = {
    title: "Crawling settings",
    description: "Manage your crawlers and crawling configuration.",
}

export default async function CrawlingPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const crawlers: any[] = []

    return (
        <DashboardShell>
        <DashboardHeader heading="Crawling" text="Create and manage your crawlers.">
          <CrawlerCreateButton />
        </DashboardHeader>
        <div>
          {crawlers?.length ? (
            <div className="divide-y divide-border rounded-md border">
              {crawlers.map((crawler) => (
                <div key={crawler.id}> test </div>
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