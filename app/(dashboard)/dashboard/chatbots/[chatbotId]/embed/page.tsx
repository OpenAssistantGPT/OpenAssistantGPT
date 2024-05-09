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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
            <Tabs className="w-full" defaultValue="widget">
                <TabsList className="mb-10 grid w-full grid-cols-5 gap-4">
                    <TabsTrigger value="widget">Widget</TabsTrigger>
                    <TabsTrigger value="window">Window</TabsTrigger>
                </TabsList>
                <TabsContent value="window">
                    <div className="space-y-4">
                        <CodeBlock
                            language="HTML"
                            description="If you use HTML, you can use the following code to embed your chatbot."
                        >{`<iframe 
    src="${siteConfig.url}embed/${params.chatbotId}/window?chatbox=false"
    style="overflow: hidden; height: 80vh; border: 0 none; width: 480px; bottom: -30px;"
    allowfullscreen allow="clipboard-read; clipboard-write" allowtransparency
>
</iframe>
`}
                        </CodeBlock>
                    </div>
                </TabsContent>
                <TabsContent value="widget">
                    <div className="space-y-4">
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
    (window as any).chatbotConfig = {
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
                    </div>
                </TabsContent>
            </Tabs>

        </DashboardShell >
    )
}