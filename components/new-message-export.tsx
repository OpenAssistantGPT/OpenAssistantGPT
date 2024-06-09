"use client"

import * as React from "react"
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
import { Chatbot } from "@prisma/client"
import { exportMessagesSchema } from "@/lib/validations/exportMessages"
import Select from 'react-select';

type FormData = z.infer<typeof exportMessagesSchema>

interface NewMessageExportFormProps extends React.HTMLAttributes<HTMLFormElement> { 
    chatbots: Pick<Chatbot, 'id' | 'name'>[]
}

export function NewMessageExportForm({ chatbots, className, ...props }: NewMessageExportFormProps) {
    const router = useRouter()
    const form = useForm<FormData>({
        resolver: zodResolver(exportMessagesSchema),
        defaultValues: {
            lastXDays: 7,
        }
    })
    const [isSaving, setIsSaving] = React.useState<boolean>(false)

    async function onSubmit(data: FormData) {
        setIsSaving(true)

        const response = await fetch(`/api/exports`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chatbotId: data.chatbotId,
                lastXDays: data.lastXDays,
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
                description: "Your export was not saved. Please try again.",
                variant: "destructive",
            })
        }

        toast({
            description: "Your export was created.",
        })
        router.refresh()
        router.push(`/dashboard/exports`)
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
                        <CardTitle>Export chatbot messages</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="lastXDays"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="lastXDays">
                                        Export messages from the last X days
                                    </FormLabel>
                                    <Input
                                        id="lastXDays"
                                        type="number"
                                        onChange={e => field.onChange(parseInt(e.target.value))}
                                    />
                                    <FormDescription>
                                        Export messages from the last X days. It can be any number between 1 and 365.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="chatbotId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="chatbotId">
                                        Chatbot To Export Messages
                                    </FormLabel>
                                    <Select
                                        onChange={value => field.onChange(value!.value)}
                                        defaultValue={field.value}
                                        id="chatbotId"
                                        options={
                                            chatbots.map(chatbot => ({
                                                value: chatbot.id,
                                                label: chatbot.name,
                                            }))
                                        }
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                    <FormDescription>
                                        The chatbot from which to export messages
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
            </form>
        </Form >
    )
}
