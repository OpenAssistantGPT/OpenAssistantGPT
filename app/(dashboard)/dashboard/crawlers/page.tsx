
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { CrawlerCreateButton } from "@/components/crawler-create-button"
import { db } from "@/lib/db"
import { CrawlerItem } from "@/components/crawler-item"
import { siteConfig } from "@/config/site"


export const metadata = {
  title: `${siteConfig.name} - Crawlers`,
  description: "Manage your crawlers and crawling configuration.",
}

export default async function CrawlersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const crawlers = await db.crawler.findMany({
    where: {
      userId: user.id,
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Crawlers" text="Manage your crawlers and crawling configuration.">
        <CrawlerCreateButton />
      </DashboardHeader>
      <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
        <p className="font-bold text-md">Warning</p>
        <p className="text-sm">Our crawlers don&apos;t support website generated with javascript at runtime yet. If the website is made with React we won&apos;t be able to fetch the content.</p>
        <p className="text-sm">We recommend use <a className="underline" href="https://github.com/BuilderIO/gpt-crawler">gpt-crawler</a> to crawl your website localy and then upload your file to {siteConfig.name}.</p>
      </div>
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