"use client"

import { useEffect, useState } from "react"
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
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { advancedSettingsSecurityFormSchema, advancedSettingsSecuritySchema } from "@/lib/validations/advancedSettings"
import { Tag, TagInput } from 'emblor';
import { Switch } from "@/components/ui/switch"


interface ChatbotFormProps extends React.HTMLAttributes<HTMLFormElement> {
    chatbot: Chatbot
}

type FormData = z.infer<typeof advancedSettingsSecurityFormSchema>

export function ChatbotAdvancedSecuritySettingsForm({ chatbot, ...props }: ChatbotFormProps) {
    const router = useRouter()
    const form = useForm<FormData>({
        resolver: zodResolver(advancedSettingsSecurityFormSchema),
        defaultValues: {
            bannedIps: chatbot.bannedIps,
            allowEveryone: chatbot.allowEveryone,
            allowedIpRanges: chatbot.allowedIpRanges,
        },
    })

    const [bannedIps, setBannedIPs] = useState<Tag[]>([]);
    const [bannedIPsActiveTagIndex, setBannedIpsActiveTagIndex] = useState<number | null>(null);

    const [allowedIPs, setAllowedIPs] = useState<Tag[]>([]);
    const [allowedIPsActiveTagIndex, setAllowedIpsActiveTagIndex] = useState<number | null>(null);

    const { setValue } = form;
    const [isSaving, setIsSaving] = useState<boolean>(false)

    useEffect(() => {
        setAllowedIPs(chatbot.allowedIpRanges.map((ip, index) => ({ id: index.toString(), text: ip, label: ip, value: ip })))
        setBannedIPs(chatbot.bannedIps.map((ip, index) => ({ id: index.toString(), text: ip, label: ip, value: ip })))
    }, [])

    async function onSubmit(data: FormData) {
        setIsSaving(true)

        const response = await fetch(`/api/chatbots/${chatbot.id}/config/security`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bannedIps: bannedIps.map(ip => ip.text),
                allowEveryone: data.allowEveryone,
                allowedIpRanges: allowedIPs.map(ip => ip.text),
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
                        <CardTitle>Chatbot Security</CardTitle>
                        <CardDescription>
                            Where you can configure the security settings for your chatbot.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="bannedIps"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="bannedIps">
                                        Banned IPs and IP Ranges
                                    </FormLabel>
                                    <FormDescription>
                                        The feature allows you to ban IPs and IP ranges from accessing the chatbot. Press ENTER after entering each IP or IP range to add many.
                                    </FormDescription>
                                    <FormControl>
                                        <TagInput
                                            id="bannedIps"
                                            placeholder="Enter IP Address 10.54.30.0"
                                            tags={bannedIps}
                                            className="sm:min-w-[450px]"
                                            inlineTags={false}
                                            setTags={(newTags) => {
                                                console.log(newTags)
                                                setBannedIPs(newTags)
                                                setValue('bannedIps', newTags as [Tag, ...Tag[]])
                                            }}
                                            activeTagIndex={bannedIPsActiveTagIndex}
                                            setActiveTagIndex={setBannedIpsActiveTagIndex}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="allowEveryone"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Allow Everyone  to access the chatbot
                                        </FormLabel>
                                        <FormDescription>
                                            This feature allows everyone to access the chatbot. You must allow IPs to access the chatbot.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="allowedIpRanges"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="allowedIpRanges">
                                        Allowed IPs and IP Ranges
                                    </FormLabel>
                                    <FormDescription>
                                        This feature allows you to specify the IPs and IP ranges that can access the chatbot. Press ENTER after entering each IP or IP range to add many.
                                    </FormDescription>
                                    <FormControl>
                                        <TagInput
                                            id="allowedIpRanges"
                                            placeholder="Enter a IP Range 10.0.0.0/16"
                                            tags={allowedIPs}
                                            className="sm:min-w-[450px]"
                                            inlineTags={false}
                                            setTags={(newTags) => {
                                                setAllowedIPs(newTags)
                                                setValue('allowedIpRanges', newTags as [Tag, ...Tag[]])
                                            }}
                                            activeTagIndex={allowedIPsActiveTagIndex}
                                            setActiveTagIndex={setAllowedIpsActiveTagIndex}
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