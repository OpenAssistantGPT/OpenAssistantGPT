"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
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
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Form, FormField, FormDescription, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form"
import { notificationSchema } from "@/lib/validations/notification"
import { Switch } from "@/components/ui/switch"

interface NotificationSettingsFormProps extends React.HTMLAttributes<HTMLFormElement> {
    user: Pick<User, "id">
    inquiryNotificationEnabled: boolean
    marketingEmailEnabled: boolean
}

type FormData = z.infer<typeof notificationSchema>

export function NotificationSettingsForm({ user, inquiryNotificationEnabled, marketingEmailEnabled, className, ...props }: NotificationSettingsFormProps) {
    const router = useRouter()
    const form = useForm<FormData>({
        resolver: zodResolver(notificationSchema),
        defaultValues: {
            inquiryNotificationEnabled: inquiryNotificationEnabled,
            marketingEmailEnabled: marketingEmailEnabled,
        },
    })
    const [isSaving, setIsSaving] = React.useState<boolean>(false)

    async function onSubmit(data: FormData) {
        setIsSaving(true)

        const response = await fetch(`/api/users/${user.id}/notifications`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inquiryNotificationEnabled: data.inquiryNotificationEnabled,
                marketingEmailEnabled: data.marketingEmailEnabled,
            }),
        })

        setIsSaving(false)

        if (!response?.ok) {
            return toast({
                title: "Something went wrong.",
                description: "Your notification settings are not updated. Please try again.",
                variant: "destructive",
            })
        }

        toast({
            description: "Your notification settings are now updated.",
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
                        <CardTitle>Notifications Settings</CardTitle>
                        <CardDescription>
                            Configure all your notification preferences here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="inquiryNotificationEnabled"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        New Inquiry Notification
                                    </FormLabel>
                                    <FormDescription>
                                        Get a notification when a new inquiry is received.
                                    </FormDescription>
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
                            name="marketingEmailEnabled"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Marketing Emails
                                    </FormLabel>
                                    <FormDescription>
                                        Receive our marketing emails. New features, updates, and more.
                                    </FormDescription>
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