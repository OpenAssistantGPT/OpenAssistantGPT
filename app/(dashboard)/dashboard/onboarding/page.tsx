
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

import { CrawlerCreateButton } from "@/components/crawler-create-button"
import { db } from "@/lib/db"
import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { OpenAIForm } from "@/components/openai-config-form"


export const metadata = {
  title: `${siteConfig.name} - Onboarding`,
  description: "Onboarding - Create your first chatbot.",
}

export default async function OnboardingPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const openAIConfig = await db.openAIConfig.findFirst({
    select: {
      id: true,
      globalAPIKey: true,
    },
    where: {
      userId: user.id,
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Onboarding" text="Create your first chatbot">
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
      <div>
        {!openAIConfig ?
          <OpenAIForm user={{ id: user.id }} />
          : <>created</>
        }
      </div>
    </DashboardShell >
  )
}