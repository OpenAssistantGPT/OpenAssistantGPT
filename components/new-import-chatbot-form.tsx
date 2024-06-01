'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { User } from "@prisma/client"
import { Textarea } from "@/components/ui/textarea"
import { importChatbotSchema } from "@/lib/validations/importChatbot"
import Link from "next/link"

type FormData = z.infer<typeof importChatbotSchema>

interface ImportChatbotProps extends React.HTMLAttributes<HTMLElement> {
    user: Pick<User, "id">
}

export function ImportChatbotForm({ className, ...props }: ImportChatbotProps) {
    const router = useRouter()
    const form = useForm<FormData>({
        resolver: zodResolver(importChatbotSchema),
        defaultValues: {
            welcomeMessage: "Hello, how can I help you?",
            chatbotErrorMessage: "Oops! An error has occurred. If the issue persists, feel free to reach out to our support team for assistance. We're here to help!"
        }
    })

    const [isSaving, setIsSaving] = useState<boolean>(false)

    async function onSubmit(data: FormData) {
        setIsSaving(true)
        console.log(data)

        const response = await fetch(`/api/chatbots/import`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
                openAIKey: data.openAIKey,
                welcomeMessage: data.welcomeMessage,
                chatbotErrorMessage: data.chatbotErrorMessage,
                openAIAssistantId: data.openAIAssistantId,
            }),
        })

        setIsSaving(false)

        if (!response?.ok) {
            if (response.status === 400) {
                return toast({
                    title: "Something went wrong.",
                    description: await response.text(),
                    variant: "destructive",
                })
            } else if (response.status === 402) {
                return toast({
                    title: "Chatbot limit reached.",
                    description: "Please upgrade to the a higher plan.",
                    variant: "destructive",
                })
            }
            return toast({
                title: "Something went wrong.",
                description: "Your chatbot was not saved. Please try again.",
                variant: "destructive",
            })
        }

        toast({
            description: "Your chatbot has been saved.",
        })

        router.refresh()

        const object = await response.json()
        router.push(`/dashboard/chatbots/${object.chatbot.id}/chat`)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Import a Chatbot</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="name">
                                        Display Name
                                    </FormLabel>
                                    <Input
                                        onChange={field.onChange}
                                        id="name"
                                    />
                                    <FormDescription>
                                        The name that will be displayed in the dashboard
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="openAIAssistantId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="openAIAssistantId">
                                        OpenAI Assistant ID
                                    </FormLabel>
                                    <Input
                                        onChange={field.onChange}
                                        id="openAIAssistantId"
                                    />
                                    <FormDescription>
                                        The OpenAI Assistant ID that already exists in your OpenAI account.
                                        You can find your Assistant ID in the <Link target="_blank" className="underline" href="https://platform.openai.com/assistants">OpenAI Assistant Dashboard</Link>.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="welcomeMessage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="welcomemessage">
                                        Welcome message
                                    </FormLabel>
                                    <Input
                                        onChange={field.onChange}
                                        value={field.value}
                                        id="welcomemessage"
                                    />
                                    <FormDescription>
                                        The welcome message that will be sent to the user when they start a conversation
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>)}
                        />
                        <FormField
                            control={form.control}
                            name="openAIKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="openAIKey">
                                        OpenAI API Key
                                    </FormLabel>
                                    <Input
                                        onChange={field.onChange}
                                        id="openAIKey"
                                        type="password"
                                    />
                                    <FormDescription>
                                        The OpenAI API key that will be used to generate responses
                                        You can create your API Key <Link target="_blank" className="underline" href='https://platform.openai.com/api-keys'>here</Link>.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="chatbotErrorMessage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="chatbotErrorMessage">
                                        Chatbot Error Message
                                    </FormLabel>
                                    <Textarea
                                        value={field.value}
                                        onChange={field.onChange}
                                        id="chatbotErrorMessage"
                                    />
                                    <FormDescription>
                                        The message that will be displayed when the chatbot encounters an error and can&apos;t reply to a user.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <button
                            type="submit"
                            className={cn(buttonVariants(), className)}
                            disabled={isSaving}
                        >
                            {isSaving && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            <span>Create</span>
                        </button>
                    </CardFooter>
                </Card>
            </form >
        </Form >
    )
}
