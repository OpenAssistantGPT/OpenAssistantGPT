import { notFound, redirect } from "next/navigation"

import { ChatbotForm } from "@/components/chatbot-form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { siteConfig } from "@/config/site"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomizationSettings } from "@/components/customization-settings"
import { InquirySettings } from "@/components/inquiry-settings"
import { ImportedChatbotForm } from "@/components/imported-chatbot-form"
import { ChatbotBrandingProSettingsForm } from "@/components/chatbot-branding-pro-settings"
import { ChatbotFileAttachementProSettingsForm } from "@/components/chatbot-file-attachement-pro-settings"
import { ChatbotAdvancedSettingsForm } from "@/components/chatbot-advanced-settings"

interface ChatbotSettingsProps {
    params: { chatbotId: string }
}

export default async function ChatbotPage({ params }: ChatbotSettingsProps) {

    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const chatbot = await db.chatbot.findFirst({
        select: {
            id: true,
            name: true,
            createdAt: true,
            openaiKey: true,
            welcomeMessage: true,
            chatbotErrorMessage: true,
            displayBranding: true,
            prompt: true,
            modelId: true,
            openaiId: true,
            isImported: true,
            chatFileAttachementEnabled: true,
            maxCompletionTokens: true,
            maxPromptTokens: true,
            rightToLeftLanguage: true,
            model: {
                select: {
                    id: true,
                    name: true,
                }
            },
        },
        where: {
            id: params.chatbotId,
            userId: user.id,
        },
    })

    if (!chatbot) {
        notFound()
    }

    const files = await db.file.findMany({
        where: {
            userId: user.id,
        },
    })

    const currentFiles = await db.chatbotFiles.findMany({
        select: {
            id: true,
            chatbotId: true,
            file: {
                select: {
                    id: true,
                    name: true,
                }
            },
        },
        where: {
            chatbotId: chatbot.id,
        },
    })

    const models = await db.chatbotModel.findMany({})

    return (
        <DashboardShell>
            <DashboardHeader heading="Chatbot" text="Configure your chatbot here">
                <Link
                    href="/dashboard/chatbots"
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
            <Tabs className="w-full" defaultValue="settings">
                <TabsList className="mb-5 grid w-full grid-cols-5 gap-4">
                    <TabsTrigger value="settings">General Settings</TabsTrigger>
                    <TabsTrigger value="advancedSettings">Advanced Settings</TabsTrigger>
                    <TabsTrigger value="customizations">Customizations</TabsTrigger>
                    <TabsTrigger value="inquiry">User Inquiry Settings</TabsTrigger>
                    <TabsTrigger value="pro">Pro features 👑</TabsTrigger>
                </TabsList>
                <TabsContent value="settings">
                    <div className="space-y-4">
                        <div className="grid gap-10">
                            {
                                !chatbot.isImported ?
                                    <ChatbotForm
                                        user={user}
                                        files={files}
                                        currentFiles={currentFiles.map((file) => file.file.id)}
                                        models={models}
                                        chatbot={chatbot} />
                                    :
                                    <ImportedChatbotForm
                                        user={user}
                                        chatbot={chatbot}
                                    />

                            }
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Chatbot id</CardTitle>
                                <CardDescription>
                                    This is the unique chatbot id generated by {siteConfig.name}.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex space-x-2">
                                    <Input value={chatbot.id} readOnly />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="advancedSettings">
                    <ChatbotAdvancedSettingsForm chatbot={chatbot} />
                </TabsContent>
                <TabsContent value="customizations">
                    <div className="space-y-4">
                        <CustomizationSettings chatbot={chatbot} />
                    </div>
                </TabsContent>
                <TabsContent value="inquiry">
                    <InquirySettings chatbot={chatbot} />
                </TabsContent>
                <TabsContent value="pro">
                    <div className="space-y-4">
                        <ChatbotBrandingProSettingsForm chatbot={chatbot} />
                        <ChatbotFileAttachementProSettingsForm chatbot={chatbot} />
                    </div>
                </TabsContent>
            </Tabs>
        </DashboardShell>
    )
}