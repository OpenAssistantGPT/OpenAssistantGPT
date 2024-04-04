"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { buttonVariants } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Chatbot } from "@prisma/client"
import { useEffect, useState } from "react"
import { Icons } from "./icons"
import { inquiryCustomizationSchema } from "@/lib/validations/inquiryCustomization"
import { Input } from "@/components/ui/input"
import { Textarea } from "./ui/textarea"

interface ChatbotOperationsProps {
    chatbot: Pick<Chatbot, "id" | "name" | "modelId">
}

export function InquirySettings({ chatbot }: ChatbotOperationsProps) {

    const [isSaving, setIsSaving] = useState<boolean>(false)

    const form = useForm<z.infer<typeof inquiryCustomizationSchema>>({
        resolver: zodResolver(inquiryCustomizationSchema),
        defaultValues: {
            inquiryEnabled: false,
        },
    })

    useEffect(() => {
        fetch(`/api/chatbots/${chatbot.id}/config`, {
            method: "GET",
        }).then((res) => res.json()).then((data) => {
            form.setValue("inquiryEnabled", data.inquiryEnabled)
            form.setValue("inquiryLinkText", data.inquiryLinkText)
            form.setValue("inquiryTitle", data.inquiryTitle)
            form.setValue("inquirySubtitle", data.inquirySubtitle)
            form.setValue("inquiryEmailLabel", data.inquiryEmailLabel)
            form.setValue("inquiryMessageLabel", data.inquiryMessageLabel)
            form.setValue("inquirySendButtonText", data.inquirySendButtonText)
            form.setValue("inquiryAutomaticReplyText", data.inquiryAutomaticReplyText)
            form.setValue("inquiryDisplayLinkAfterXMessage", data.inquiryDisplayLinkAfterXMessage)
        })
    }, [])

    async function onSubmit(data: z.infer<typeof inquiryCustomizationSchema>) {
        setIsSaving(true)

        const response = await fetch(`/api/chatbots/${chatbot.id}/config/inquiry`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inquiryEnabled: data.inquiryEnabled,
                inquiryLinkText: data.inquiryLinkText,
                inquiryTitle: data.inquiryTitle,
                inquirySubtitle: data.inquirySubtitle,
                inquiryEmailLabel: data.inquiryEmailLabel,
                inquiryMessageLabel: data.inquiryMessageLabel,
                inquirySendButtonText: data.inquirySendButtonText,
                inquiryAutomaticReplyText: data.inquiryAutomaticReplyText,
                inquiryDisplayLinkAfterXMessage: data.inquiryDisplayLinkAfterXMessage,
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
                    title: "Chatbot not customizable.",
                    description: "Please upgrade to the a higher plan.",
                    variant: "destructive",
                })
            }

            return toast({
                title: "Something went wrong.",
                description: "Your inquiry settings were not updated. Please try again.",
                variant: "destructive",
            })
        }

        toast({
            description: "Your inquiry settings are updated.",
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <div>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="inquiryEnabled"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Enable User Inquiry / Support Ticket Feature
                                        </FormLabel>
                                        <FormDescription>
                                            Enable or disable the user inquiry feature. When enabled, users can send inquiries to the chatbot and you will see them in the dashboard.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inquiryLinkText"
                            render={({ field }) => (
                                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Inquiry Link Text
                                        </FormLabel>
                                        <FormDescription>
                                            The text that prompts users to click on the link, leading them to access the inquiry form.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Input
                                            defaultValue={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inquiryTitle"
                            render={({ field }) => (
                                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Inquiry Form Title Text
                                        </FormLabel>
                                        <FormDescription>
                                            The title text of the inquiry form.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Input
                                            defaultValue={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inquirySubtitle"
                            render={({ field }) => (
                                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Inquiry Form Subtitle text
                                        </FormLabel>
                                        <FormDescription>
                                            The subtitle text of the inquiry form.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Textarea
                                            defaultValue={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inquiryAutomaticReplyText"
                            render={({ field }) => (
                                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Inquiry Automatic Reply Message Text
                                        </FormLabel>
                                        <FormDescription>
                                            The message sent to the user after they have submitted an inquiry.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Textarea
                                            defaultValue={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inquiryEmailLabel"
                            render={({ field }) => (
                                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Email Input Label
                                        </FormLabel>
                                        <FormDescription>
                                            The label over the email input field
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Input
                                            defaultValue={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inquiryMessageLabel"
                            render={({ field }) => (
                                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Message Textarea Label
                                        </FormLabel>
                                        <FormDescription>
                                            The label over the message textarea field
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Input
                                            defaultValue={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inquirySendButtonText"
                            render={({ field }) => (
                                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Text in the send button
                                        </FormLabel>
                                        <FormDescription>
                                            The text displayed in the send button
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Input
                                            defaultValue={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inquiryDisplayLinkAfterXMessage"
                            render={({ field }) => (
                                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Display Link After X Chatbot Reply
                                        </FormLabel>
                                        <FormDescription>
                                            The number of chatbot replies after which the inquiry link will be displayed to the user. We highly to one and the higher the number the lower the number of inquiry you will receive.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={5}
                                            defaultValue={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
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
            </form>
        </Form >
    )
}
