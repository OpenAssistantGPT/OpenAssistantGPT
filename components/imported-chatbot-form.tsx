"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Chatbot, User } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { importChatbotSchema } from "@/lib/validations/importChatbot"
import { Switch } from "./ui/switch"

interface ChatbotFormProps extends React.HTMLAttributes<HTMLFormElement> {
    chatbot: Pick<Chatbot, "id" | "name" | "openaiKey" | "modelId" | "createdAt" | "welcomeMessage" | "prompt" | "chatbotErrorMessage" | "isImported" | "openaiId" | "rightToLeftLanguage">
    user: Pick<User, "id">
}

type FormData = z.infer<typeof importChatbotSchema>

export function ImportedChatbotForm({ chatbot, className, ...props }: ChatbotFormProps) {
    const router = useRouter()
    const form = useForm<FormData>({
        resolver: zodResolver(importChatbotSchema),
        defaultValues: {
            name: chatbot.name,
            openAIKey: chatbot.openaiKey,
            welcomeMessage: chatbot.welcomeMessage,
            chatbotErrorMessage: chatbot.chatbotErrorMessage,
            openAIAssistantId: chatbot.openaiId,
            rightToLeftLanguage: chatbot.rightToLeftLanguage,
        }
    })
    const [isSaving, setIsSaving] = useState<boolean>(false)

    async function onSubmit(data: FormData) {
        console.log(data)
        setIsSaving(true)

        const response = await fetch(`/api/chatbots/${chatbot.id}/imported`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
                openAIKey: data.openAIKey,
                openAIAssistantId: data.openAIAssistantId,
                welcomeMessage: data.welcomeMessage,
                chatbotErrorMessage: data.chatbotErrorMessage,
                rightToLeftLanguage: data.rightToLeftLanguage,
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
            }

            return toast({
                title: "Something went wrong.",
                description: "Your chatbot was not updated. Please try again.",
                variant: "destructive",
            })
        }

        toast({
            description: "Your chatbot has been updated.",
        })

        router.refresh()
    }

    return (
        <Form {...form}>
            <form
                className={cn(className)}
                onSubmit={form.handleSubmit(onSubmit)}
                {...props}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Chatbot settings</CardTitle>
                        <CardDescription>
                            Update your chatbot configuration.
                        </CardDescription>
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
                                        defaultValue={chatbot.name}
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
                                        defaultValue={chatbot.openaiId}
                                        onChange={field.onChange}
                                        id="openAIAssistantId"
                                    />
                                    <FormDescription>
                                        The OpenAI Assistant ID that already exists in your OpenAI account.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="openAIKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="openAIKey">
                                        OpenAI Key
                                    </FormLabel>
                                    <Input
                                        defaultValue={chatbot.openaiKey}
                                        onChange={field.onChange}
                                        id="openAIKey"
                                        type="password"
                                    />
                                    <FormDescription>
                                        The API key that will be used to generate responses
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
                                    <FormLabel htmlFor="welcomeMessage">
                                        Welcome Message
                                    </FormLabel >
                                    <Input
                                        defaultValue={chatbot.welcomeMessage}
                                        onChange={field.onChange}
                                        id="welcomeMessage"
                                    />
                                    <FormDescription>
                                        The first message that will be sent to the user when they start a conversation with your chatbot.
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
                                        defaultValue={chatbot.chatbotErrorMessage}
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
                        <FormField
                            control={form.control}
                            name="rightToLeftLanguage"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-left justify-between">
                                    <FormLabel >
                                        Right to Left Language
                                    </FormLabel>
                                    <FormDescription>
                                        If your chatbot default language is right to left, enable this option. This will change the chatbot layout to support right to left languages.
                                        <br/>
                                        Example of right to left languages: Arabic, Hebrew, Persian, Urdu, etc.
                                    </FormDescription>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
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
                            <span>Save</span>
                        </button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}