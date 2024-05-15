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
import { CodeBlock } from "@/components/ui/codeblock"
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
                            language="html"
                            value={`<iframe 
    src="${siteConfig.url}embed/${params.chatbotId}/window?chatbox=false"
    style="overflow: hidden; height: 80vh; border: 0 none; width: 480px; bottom: -30px;"
    allowfullscreen allow="clipboard-read; clipboard-write" allowtransparency
>
</iframe>
`}>
                        </CodeBlock>
                    </div>
                </TabsContent>
                <TabsContent value="widget">
                    <div className="space-y-4">
                        <CodeBlock
                            language="html"
                            value={`<script>
    window.addEventListener("message",function(t){if("openChat"===t.data){console.log("Toggle chat visibility");var e=document.getElementById("openassistantgpt-chatbot-iframe");e?(e.style.display="block",e.style.pointerEvents="auto"):console.error("iframe not found")}if("closeChat"===t.data){var e=document.getElementById("openassistantgpt-chatbot-iframe");e&&(e.style.display="none",e.style.pointerEvents="none")}});
</script>

<body>
  <iframe src="${siteConfig.url}embed/${params.chatbotId}/button?chatbox=false"
    style="margin-right: 1rem; margin-bottom: 1rem; position: absolute; right: 0; bottom: 0; width: 56px; height: 56px; border: 0; border-color: rgb(0, 0, 0); border-radius: 50%; color-scheme: none; background: none;"
    allowtransparency></iframe>
  <iframe src="${siteConfig.url}embed/${params.chatbotId}/window?chatbox=false"
    style="margin-right: 1rem; margin-bottom: 6rem; display: none; position: absolute; right: 0; bottom: 0; pointer-events: none; overflow: hidden; height: 65vh; border: 2px solid #e2e8f0; border-radius: 0.375rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); width: 30rem;"
    allowfullscreen id="openassistantgpt-chatbot-iframe" allowtransparency></iframe>
</body>
`}>
                        </CodeBlock>
                        <CodeBlock
                            language="javascript"
                            value={`
export default function Chatbot() {

    return (
        <div>
            <script dangerouslySetInnerHTML={{
                __html: \`
        window.addEventListener("message",function(t){if("openChat"===t.data){console.log("Toggle chat visibility");var e=document.getElementById("openassistantgpt-chatbot-iframe");e?(e.style.display="block",e.style.pointerEvents="auto"):console.error("iframe not found")}if("closeChat"===t.data){var e=document.getElementById("openassistantgpt-chatbot-iframe");e&&(e.style.display="none",e.style.pointerEvents="none")}});
      \`}} />
            <iframe
                src="${siteConfig.url}embed/${params.chatbotId}/button?chatbox=false"
                scrolling='no'
                className="fixed bottom-0 right-0 mb-4 z-50 flex items-end inline-block mr-4 w-14 h-14 border border-gray-300 rounded-full shadow-md"
            ></iframe>
            <iframe
                src="${siteConfig.url}embed/${params.chatbotId}/window?chatbox=false"
                className='md:block fixed mr-4 mb-24 fixed right-0 bottom-0 pointer-events-none overflow-hidden h-4/6 border border-gray-300 rounded-lg shadow-md'
                style={{
                    display: 'none',
                    width: '30rem'
                }}
                id="openassistantgpt-chatbot-iframe"
            ></iframe>
        </div>
    )
}
`}>
                        </CodeBlock>
                    </div>
                </TabsContent>
            </Tabs >

        </DashboardShell >
    )
}