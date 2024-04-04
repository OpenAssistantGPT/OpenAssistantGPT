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
import { customizationSchema } from "@/lib/validations/customization"
import { useEffect, useState } from "react"
import { Icons } from "./icons"
import { Input } from "./ui/input"
import { GradientPicker } from "@/components/gradient-picker"
import { Button } from "@/components/ui/button"

interface ChatbotOperationsProps {
    chatbot: Pick<Chatbot, "id" | "name" | "modelId">
}

export function CustomizationSettings({ chatbot }: ChatbotOperationsProps) {

    const [bubbleColor, setBubbleColor] = useState('')
    const [bubbleLogoColor, setBubbleLogoColor] = useState('')
    const [chatHeaderBackgroundColor, setChatHeaderBackgroundColor] = useState('')
    const [chatHeaderTextColor, setChatHeaderTextColor] = useState('')
    const [chatbotBubbleColor, setChatbotBubbleColor] = useState('')
    const [chatbotMessageColor, setChatbotMessageColor] = useState('')
    const [userBubbleColor, setUserBubbleColor] = useState('')
    const [userBubbleMessageColor, setUserBubbleMessageColor] = useState('')


    const [isSaving, setIsSaving] = useState<boolean>(false)

    const form = useForm<z.infer<typeof customizationSchema>>({
        resolver: zodResolver(customizationSchema),
        defaultValues: {
            displayBranding: true,
            chatTitle: "",
            chatMessagePlaceHolder: "",
            bubbleColor: "",
            bubbleTextColor: "",
            chatHeaderBackgroundColor: "",
            chatHeaderTextColor: "",
            chatbotReplyBackgroundColor: "",
            chatbotReplyTextColor: "",
            userReplyBackgroundColor: "",
            userReplyTextColor: "",
        },
    })

    useEffect(() => {
        fetch(`/api/chatbots/${chatbot.id}/config`, {
            method: "GET",
        }).then((res) => res.json()).then((data) => {
            form.setValue("displayBranding", data.displayBranding)
            form.setValue("chatTitle", data.chatTitle)
            form.setValue("chatMessagePlaceHolder", data.chatMessagePlaceHolder)

            // get the colors from the chatbot
            setBubbleColor(data.bubbleColor)
            setBubbleLogoColor(data.bubbleTextColor)
            setChatHeaderBackgroundColor(data.chatHeaderBackgroundColor)
            setChatHeaderTextColor(data.chatHeaderTextColor)
            setChatbotBubbleColor(data.chatbotReplyBackgroundColor)
            setChatbotMessageColor(data.chatbotReplyTextColor)
            setUserBubbleColor(data.userReplyBackgroundColor)
            setUserBubbleMessageColor(data.userReplyTextColor)
        })
    }, [])

    async function onSubmit(data: z.infer<typeof customizationSchema>) {
        setIsSaving(true)

        const response = await fetch(`/api/chatbots/${chatbot.id}/config/customization`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                displayBranding: data.displayBranding,
                chatTitle: data.chatTitle,
                chatMessagePlaceHolder: data.chatMessagePlaceHolder,
                bubbleColor: bubbleColor,
                bubbleTextColor: bubbleLogoColor,
                chatHeaderBackgroundColor: chatHeaderBackgroundColor,
                chatHeaderTextColor: chatHeaderTextColor,
                chatbotReplyBackgroundColor: chatbotBubbleColor,
                chatbotReplyTextColor: chatbotMessageColor,
                userReplyBackgroundColor: userBubbleColor,
                userReplyTextColor: userBubbleMessageColor,
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
                description: "Your chatbot was not updated. Please try again.",
                variant: "destructive",
            })
        }

        toast({
            description: "Your chatbot has been updated.",
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <div>
                    <h3 className="mb-4 text-lg font-medium">Chatbot Customizations</h3>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="displayBranding"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            OpenAssistantGPT Branding Label
                                        </FormLabel>
                                        <FormDescription>
                                            Remove &quot;Powered by OpenAssistantGPT&quot; from the chatbot.
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
                            name="chatTitle"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-left justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Chatbox Title
                                        </FormLabel>
                                        <FormDescription>
                                            Change the chatbox title.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="chatMessagePlaceHolder"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-left justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Chatbox Input Message Placeholder Text
                                        </FormLabel>
                                        <FormDescription>
                                            Update the placeholder text in the chatbox input.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="bubbleColor"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-left justify-between rounded-lg border p-4">
                                    <div className="space-y-4">
                                        <h1>Customize Your Chatbot Widget</h1>
                                        <div className="flex">
                                            <div className="flex flex-col w-full justify space-y-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">
                                                        Chatbot Background Bubble Color
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Select the color you want to use for your chatbot bubble
                                                    </FormDescription>
                                                    <FormControl>
                                                        <GradientPicker background={bubbleColor} setBackground={setBubbleColor} />
                                                    </FormControl>
                                                </div>

                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">
                                                        Chatbot Logo Color
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Select the color you want to use for your chatbot logo color
                                                    </FormDescription>
                                                    <FormControl>
                                                        <GradientPicker withGradient={false} background={bubbleLogoColor} setBackground={setBubbleLogoColor} />
                                                    </FormControl>
                                                </div>
                                            </div>
                                            <div className="flex w-full items-center text-center justify-center">
                                                <div className="ml-4 mr-4 shadow-lg border bg-white border-gray-200 rounded-full p-4" style={{ background: bubbleColor }}>
                                                    <Icons.message style={{ color: bubbleLogoColor }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="headerColor"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-left justify-between rounded-lg border p-4">
                                    <div className="space-y-4">
                                        <h1>Customize Your Chatbox Header</h1>
                                        <div className="flex">
                                            <div className="flex flex-col w-full justify space-y-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">
                                                        Chatbot Header Background Color
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Select the color you want to use for your chatbox header background
                                                    </FormDescription>
                                                    <FormControl>
                                                        <GradientPicker background={chatHeaderBackgroundColor} setBackground={setChatHeaderBackgroundColor} />
                                                    </FormControl>
                                                </div>

                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">
                                                        Chatbot Header Text Color
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Select the color you want to use for your chatbot header text color
                                                    </FormDescription>
                                                    <FormControl>
                                                        <GradientPicker withGradient={false} background={chatHeaderTextColor} setBackground={setChatHeaderTextColor} />
                                                    </FormControl>
                                                </div>
                                            </div>
                                            <div className="flex w-full items-center text-center justify-center">
                                                <div style={{ background: chatHeaderBackgroundColor }} className="flex rounded-t-lg shadow justify-between items-center p-4">
                                                    <h3 style={{ color: chatHeaderTextColor }} className="text-xl font-semibold">Chat with our AI</h3>
                                                    <div>
                                                        <Button variant="ghost">
                                                            <Icons.close style={{ color: chatHeaderTextColor }} className="h-5 w-5 text-gray-500" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="chatbotReply"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-left justify-between rounded-lg border p-4">
                                    <div className="space-y-4">
                                        <h1 className="">Personalize Your Chatbot Responses</h1>
                                        <div className="flex">
                                            <div className="flex flex-col w-full justify space-y-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">
                                                        Customize Chatbot Message Bubble Color
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Choose the color for your chatbot&apos;s message bubble background.
                                                    </FormDescription>
                                                    <FormControl>
                                                        <GradientPicker background={chatbotBubbleColor} setBackground={setChatbotBubbleColor} />
                                                    </FormControl>
                                                </div>

                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">
                                                        Customize Chatbot Text Color
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Choose the color for the text in your chatbot&apos;s messages.
                                                    </FormDescription>
                                                    <FormControl>
                                                        <GradientPicker withGradient={false} background={chatbotMessageColor} setBackground={setChatbotMessageColor} />
                                                    </FormControl>
                                                </div>
                                            </div>
                                            <div className="flex w-full items-center text-center justify-center">
                                                <div key="0" className="flex w-5/6 items-end gap-2">
                                                    <div className="rounded-lg bg-zinc-200 p-2" style={{ background: chatbotBubbleColor }}>
                                                        <p className="text-md" style={{ color: chatbotMessageColor }}>Welcome to OpenAssitantGPT! How can we help you?</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="userReply"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-left justify-between rounded-lg border p-4">
                                    <div className="space-y-4">
                                        <h1>Customize Your User Reply</h1>
                                        <div className="flex">
                                            <div className="flex flex-col w-full justify space-y-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">
                                                        User Background Message Color
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Choose the color for the background of your user&apos;s messages.
                                                    </FormDescription>
                                                    <FormControl>
                                                        <GradientPicker background={userBubbleColor} setBackground={setUserBubbleColor} />
                                                    </FormControl>
                                                </div>

                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">
                                                        User Message Text Color
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Choose the color for the text in your user&apos;s messages.
                                                    </FormDescription>
                                                    <FormControl>
                                                        <GradientPicker withGradient={false} background={userBubbleMessageColor} setBackground={setUserBubbleMessageColor} />
                                                    </FormControl>
                                                </div>

                                            </div>
                                            <div className="flex w-full items-center text-center justify-center">
                                                <div key="0" className="flex w-5/6 items-end gap-2">
                                                    <div className="rounded-lg bg-zinc-200 p-2" style={{ background: userBubbleColor }}>
                                                        <p className="text-md" style={{ color: userBubbleMessageColor }}>I need help with my customization what color should I choose?</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
