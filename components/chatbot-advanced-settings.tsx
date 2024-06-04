"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Chatbot } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { advancedSettingsSchema } from "@/lib/validations/advancedSettings"
import Link from "next/link"

interface ChatbotFormProps extends React.HTMLAttributes<HTMLFormElement> {
    chatbot: Pick<Chatbot, "id" | "maxCompletionTokens" | "maxPromptTokens">
}

type FormData = z.infer<typeof advancedSettingsSchema>

export function ChatbotAdvancedSettingsForm({ chatbot, ...props }: ChatbotFormProps) {
    const router = useRouter()
    const form = useForm<FormData>({
        resolver: zodResolver(advancedSettingsSchema),
        defaultValues: {
            maxCompletionTokens: chatbot.maxCompletionTokens || undefined,
            maxPromptTokens: chatbot.maxPromptTokens || undefined,
        }
    })
    const [isSaving, setIsSaving] = useState<boolean>(false)

    async function onSubmit(data: FormData) {
        setIsSaving(true)

        const response = await fetch(`/api/chatbots/${chatbot.id}/config/advanced`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                maxCompletionTokens: data.maxCompletionTokens,
                maxPromptTokens: data.maxPromptTokens,
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
                description: "Your advanced settings are not updated. Please try again.",
                variant: "destructive",
            })
        }

        toast({
            description: "Your advanced settings are now updated.",
        })

        router.refresh()
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                {...props}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Max Prompt Tokens</CardTitle>
                        <CardDescription>
                            This is the maximum number of tokens that can be used in a prompt and for completions, to find out more about tokens, please refer to the documentation.
                            <Link href="https://platform.openai.com/docs/assistants/how-it-works/managing-threads-and-messages" className="underlined">Learn more</Link>
                            <br />
                            When using the File Attachements, we recommend setting the Max Prompt Token to no less than 20,000. For longer conversations or multiple interactions with File Attachements, consider increasing this limit to 50,000, or ideally, removing the Max Prompt Tokens limits altogether to get the highest quality results.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="maxPromptTokens"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="maxPromptTokens">
                                        Max Prompt Tokens
                                    </FormLabel>

                                    <Input
                                        defaultValue={chatbot.maxPromptTokens || undefined}
                                        onChange={e => field.onChange(Number(e.target.value))}
                                        type="number"
                                        id="maxPromptTokens"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxCompletionTokens"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="maxCompletionTokens">
                                        Max Completion Tokens
                                    </FormLabel>

                                    <Input
                                        defaultValue={chatbot.maxCompletionTokens || undefined}
                                        onChange={e => field.onChange(Number(e.target.value))}
                                        type="number"
                                        id="maxCompletionTokens"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <button
                            type="submit"
                            className={buttonVariants()}
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