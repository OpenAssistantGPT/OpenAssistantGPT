
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const bots: any[] = []
  //const posts = await db.chatbots.findMany({
  //  where: {
  //    authorId: user.id,
  //  },
  //  select: {
  //    id: true,
  //    title: true,
  //    published: true,
  //    createdAt: true,
  //  },
  //  orderBy: {
  //    updatedAt: "desc",
  //  },
  //})

  return (
    <DashboardShell>
      <DashboardHeader heading="Chatbots" text="Create and manage your chatbots.">
        <PostCreateButton />
      </DashboardHeader>
      <div>
        {bots?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {bots.map((post) => (
              <div key={post.id} > test </div>
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No chatbots created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any chatbot yet. Start creating content.
            </EmptyPlaceholder.Description>
            <PostCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell >
  )
}