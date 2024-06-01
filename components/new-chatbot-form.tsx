'use client'

import { useEffect, useState } from "react"
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
import { chatbotSchema } from "@/lib/validations/chatbot"
import { ChatbotModel, File, User } from "@prisma/client"
import Select from 'react-select';
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

type FormData = z.infer<typeof chatbotSchema>

interface NewChatbotProps extends React.HTMLAttributes<HTMLElement> {
    isOnboarding: boolean
    user: Pick<User, "id">
}

export function NewChatbotForm({ isOnboarding, className, ...props }: NewChatbotProps) {
    const router = useRouter()
    const form = useForm<FormData>({
        resolver: zodResolver(chatbotSchema),
        defaultValues: {
            welcomeMessage: "Hello, how can I help you?",
            prompt: "You are an assistant you help users that visit our website, keep it short, always refer to the documentation provided and never ask for more information.",
            chatbotErrorMessage: "Oops! An error has occurred. If the issue persists, feel free to reach out to our support team for assistance. We're here to help!"
        }
    })

    const [models, setModels] = useState<ChatbotModel[]>([])
    const [availablesModels, setAvailablesModels] = useState<string[]>([])
    const [files, setFiles] = useState<File[]>([])
    const [isSaving, setIsSaving] = useState<boolean>(false)

    useEffect(() => {
        const init = async () => {
            const response = await fetch('/api/models', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const models = await response.json()
            setModels(models)

            const supportedModels = await getAvailableModels()
            setAvailablesModels(supportedModels)

            const filesResponse = await getFiles()
            setFiles(filesResponse)
        }
        init()
    }, [])

    async function getFiles() {
        const response = await fetch('/api/files', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })

        const files = await response.json()
        return files
    }

    async function getAvailableModels() {
        const response = await fetch(`/api/users/${props.user.id}/openai/models`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const models = await response.json()
        return models
    }

    async function onSubmit(data: FormData) {
        setIsSaving(true)
        console.log(data)

        const response = await fetch(`/api/chatbots`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
                prompt: data.prompt,
                openAIKey: data.openAIKey,
                welcomeMessage: data.welcomeMessage,
                chatbotErrorMessage: data.chatbotErrorMessage,
                modelId: data.modelId,
                files: data.files
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

        if (!isOnboarding) {
            const object = await response.json()
            router.push(`/dashboard/chatbots/${object.chatbot.id}/chat`)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Create new Chatbot</CardTitle>
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
                            name="prompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="prompt">
                                        Default prompt
                                    </FormLabel >
                                    <Textarea
                                        onChange={field.onChange}
                                        value={field.value}
                                        id="prompt"
                                    />
                                    <FormDescription>
                                        The prompt that will be sent to OpenAI for every messages, here&apos;s and example:
                                        &quot;You are an assistant you help users that visit our website, keep it short, always refer to the documentation provided and never ask for more information.&quot;
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="files"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="files">
                                        Choose your file for retrival
                                    </FormLabel>
                                    <Select
                                        isMulti
                                        closeMenuOnSelect={false}
                                        onChange={value => field.onChange(value.map((v) => v.value))}
                                        defaultValue={field.value}
                                        name="files"
                                        id="files"
                                        options={files.map((file) => ({ value: file.id, label: file.name }))}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />

                                    <FormDescription>
                                        The OpenAI model will use this file to search for specific content.
                                        If you don&apos;t have a file yet, it is because you haven&apos;t published any file.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="modelId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="modelId">
                                        OpenAI Model
                                    </FormLabel>
                                    <Select
                                        onChange={value => field.onChange(value!.value)}
                                        defaultValue={field.value}
                                        id="modelId"
                                        options={
                                            models.filter((model: ChatbotModel) => availablesModels.includes(model.name)).map((model: ChatbotModel) => (
                                                { value: model.id, label: model.name }
                                            ))
                                        }
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                    <FormDescription>
                                        The OpenAI model that will be used to generate responses.
                                        <b> If you don&apos;t have the gpt-4 option and want to use it. You need to have an OpenAI account at least tier 1.</b>
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
                                        OpenAI API Key
                                    </FormLabel>
                                    <Input
                                        onChange={field.onChange}
                                        id="openAIKey"
                                        type="password"
                                    />
                                    <FormDescription>
                                        The OpenAI API key that will be used to generate responses.
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
