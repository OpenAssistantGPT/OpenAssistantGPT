import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { UploadFileForm } from "@/components/upload-file-form"
import { NewChatbotForm } from "@/components/new-chatbot-form"

import { db } from "@/lib/db"
import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { OpenAIForm } from "@/components/openai-config-form"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Chat } from "@/components/chat"


export const metadata = {
  title: `${siteConfig.name} - Onboarding`,
  description: "Onboarding - Create your first chatbot.",
}

export default async function OnboardingPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  let currentStep = 1

  const openAIConfig = await db.openAIConfig.findFirst({
    select: {
      id: true,
      globalAPIKey: true,
    },
    where: {
      userId: user.id,
    },
  })

  if (openAIConfig) {
    currentStep = 2
  }

  const files = await db.file.count({
    where: {
      userId: user.id,
    },
  })

  if (files > 0) {
    currentStep = 3
  }

  const chatbot = await db.chatbot.findFirst({
    where: {
      userId: user.id,
    },
  })

  if (chatbot) {
    currentStep = 4
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Onboarding" text="Assisted guide to create your first chatbot">
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
      <div className="flex">
        <aside className="w-64 h-full border-r">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Progress Steps</h2>
            <div className="space-y-6">
              <Card className={currentStep > 1 ? "border border-green-500 p-4" : "p-4"}>
                <CardHeader>
                  <div className="flex items-center">
                    <Badge className="mr-2">1</Badge>
                    <h3 className="text-lg font-medium">Configuration</h3>
                  </div>
                </CardHeader>
                {currentStep == 1 &&
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      This step is where we configure your OpenAI API Key. You will have to go <a target="_blank" className="underline" href="https://platform.openai.com/account/api-keys">here</a> to create your API Key. Once you have it, you can paste it in the form below.
                    </p>
                  </CardContent>
                }
              </Card>
              <Card className={currentStep > 2 ? "border border-green-500 p-4" : "p-4"}>
                <CardHeader>
                  <div className="flex items-center">
                    <Badge className="mr-2">2</Badge>
                    <h3 className="text-lg font-medium">Upload file</h3>
                  </div>
                </CardHeader>

                {currentStep == 2 &&
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      This step is where you upload a file for your chatbot to use. This file can be a PDF, a Word document, or a text file. It will be used to train your chatbot.
                    </p>
                  </CardContent>
                }
              </Card>
              <Card className={currentStep > 3 ? "border border-green-500 p-4" : "p-4"}>
                <CardHeader>
                  <div className="flex items-center">
                    <Badge className="mr-2">3</Badge>
                    <h3 className="text-lg font-medium">Create your Chatbot</h3>
                  </div>
                </CardHeader>

                {currentStep == 3 &&
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      This step is where you create your first smart chatbot. Then we will be able to chat with him. 🤖
                    </p>
                  </CardContent>
                }
              </Card>
              <Card className={currentStep > 4 ? "border border-green-500 p-4" : "p-4"}>
                <CardHeader>
                  <div className="flex items-center">
                    <Badge className="mr-2">4</Badge>
                    <h3 className="text-lg font-medium">Chat</h3>
                  </div>
                </CardHeader>

                {currentStep == 4 &&
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Chat with your chatbot for the first time! 🎉
                    </p>
                  </CardContent>
                }
              </Card>
            </div>
          </div>
        </aside>
        <main className="flex-grow p-6">
          {currentStep == 1 &&
            <OpenAIForm user={{ id: user.id }} />
          }
          {currentStep == 2 &&
            <UploadFileForm />
          }
          {currentStep == 3 &&
            <NewChatbotForm isOnboarding={true} />
          }
          {currentStep == 4 &&
            <div>
              <div className="mb-4 bg-blue-100 border-l-4 border-blue-500 text-black p-4" role="info">
                <p className="font-bold text-md">Congratulations 🎉 </p>
                <p className="text-sm">Now that your first chatbot is created your now chat with him.</p>
                <p className="text-sm">There is still one more step if you want to embed the chatbot in your website like we did for this website you are currently in.</p>
                <br />
                <p className="borderinline-flex items-center text-sm justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background" >
                  <Link href={`/dashboard/chatbots/${chatbot!.id}/embed`} className="flex w-full">
                    See how to embed our chatbot on your website
                  </Link>
                </p>
              </div>
              <Chat chatbot={chatbot!}></Chat>
            </div>
          }

        </main>
      </div>
    </DashboardShell >
  )
}