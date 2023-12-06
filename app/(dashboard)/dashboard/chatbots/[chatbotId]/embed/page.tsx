import { getCurrentUser } from "@/lib/session"
import { notFound, redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Chatbot, User } from "@prisma/client"
import { db } from "@/lib/db"
import Link from "next/link"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { CodeBlock } from "@/components/code-block"
import { siteConfig } from "@/config/site"

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

export default async function EmbedOnSitePage({ params }: ChatbotSettingsProps) {

    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const chatbot = await getChatbotForUser(params.chatbotId, user.id)

    if (!chatbot) {
        notFound()
    }

    return (
        <DashboardShell>
            <DashboardHeader heading="Embed On Website" text="Make your chatbot publicly accessible for users.">
                <Link
                    href={`/dashboard/chatbots`}
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
            <CodeBlock
                language="HTML"
                description="If you use HTML, you can use the following code to embed your chatbot."
            >{`<script>
  window.chatbotConfig = {
    chatbotId: '${params.chatbotId}',
  }
</script>

<body>
  <script src="${siteConfig.url}chatbot.js"></script>
</body>
`}
            </CodeBlock>
            <CodeBlock
                language="NEXT.JS"
                description="If you use Next.js, you can use the following code to embed your chatbot."
            >{`"use client"

import Script from 'next/script'
import React, { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Set your global variable here
    window.chatbotConfig = {
      chatbotId: "${params.chatbotId}"
    };

  }, []);

  return (
    <main>
      <Script src="${siteConfig.url}chatbot.js" strategy="afterInteractive" />
    </main>
  )
}
`}
            </CodeBlock>
        </DashboardShell >
    )
}