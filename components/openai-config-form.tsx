"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { openAIConfigSchema } from "@/lib/validations/openaiConfig"
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
import { Form, FormField, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
    user: Pick<User, "id">
}

type FormData = z.infer<typeof openAIConfigSchema>

export function OpenAIForm({ user, className, ...props }: UserNameFormProps) {
    const router = useRouter()
    const [isSaving, setIsSaving] = React.useState<boolean>(false)
    const form = useForm<FormData>({
        resolver: zodResolver(openAIConfigSchema),
        defaultValues: {
            globalAPIKey: "",
        },
    })

    React.useEffect(() => {
        async function fetchOpenAIConfig() {
            const response = await fetch(`/api/users/${user.id}/openai`)

            if (response.ok) {
                const data = await response.json()
                form.reset(data)
            }
        }

        fetchOpenAIConfig()
    }, [user.id, form])

    async function onSubmit(data: FormData) {
        setIsSaving(true)

        const response = await fetch(`/api/users/${user.id}/openai`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                globalAPIKey: data.globalAPIKey,
            }),
        })

        setIsSaving(false)

        if (!response?.ok) {
            if (response.status === 400) {
                return toast({
                    title: "Invalid API key.",
                    description: "Your API key was invalid, try to generate a new one.",
                    variant: "destructive",
                })
            }

            return toast({
                title: "Something went wrong.",
                description: "Your OpenAI configuration was not updated. Please try again.",
                variant: "destructive",
            })
        }

        toast({
            description: "Your OpenAI configuration has been updated.",
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
                        <CardTitle>Configure your account</CardTitle>
                        <CardDescription>
                            Your global API key for OpenAI will be used for all your global configurations. It is very important to set it before creating a chatbot.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="globalAPIKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="globalAPIKey">
                                        OpenAI Global API Key
                                    </FormLabel>
                                    <Input
                                        value={field.value}
                                        onChange={field.onChange}
                                        id="globalAPIKey"
                                    />
                                    <FormDescription>
                                        This API key will be used for your global configuration. You can choose to create a new one for your chatbot.
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
                            <span>Save</span>
                        </button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}
