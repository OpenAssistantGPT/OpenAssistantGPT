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
import { toast } from "@/components/ui/use-toast"
import { Chatbot } from "@prisma/client"
import { customizationSchema } from "@/lib/validations/customization"
import { useEffect, useRef, useState } from "react"
import { Icons } from "@/components/icons"
import { Input } from "@/components/ui/input"
import { GradientPicker } from "@/components/gradient-picker"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"


interface ChatbotOperationsProps {
    chatbot: Pick<Chatbot, "id" | "name" | "modelId">
}

export function CustomizationSettings({ chatbot }: ChatbotOperationsProps) {
    const inputFileRef = useRef<HTMLInputElement>(null);

    const [bubbleColor, setBubbleColor] = useState('')
    const [bubbleLogoColor, setBubbleLogoColor] = useState('')
    const [chatHeaderBackgroundColor, setChatHeaderBackgroundColor] = useState('')
    const [chatHeaderTextColor, setChatHeaderTextColor] = useState('')
    const [userBubbleColor, setUserBubbleColor] = useState('')
    const [userBubbleMessageColor, setUserBubbleMessageColor] = useState('')
    const [chatbotLogoURL, setChatbotLogoURL] = useState('')
    const [useDefaultImage, setUseDefaultImage] = useState<boolean>(true)

    const [isSaving, setIsSaving] = useState<boolean>(false)

    const form = useForm<z.infer<typeof customizationSchema>>({
        resolver: zodResolver(customizationSchema),
        defaultValues: {
            chatTitle: "",
            chatMessagePlaceHolder: "",
            bubbleColor: "",
            bubbleTextColor: "",
            chatHeaderBackgroundColor: "",
            chatHeaderTextColor: "",
            userReplyBackgroundColor: "",
            userReplyTextColor: "",
        },
    })

    useEffect(() => {
        fetch(`/api/chatbots/${chatbot.id}/config`, {
            method: "GET",
        }).then((res) => res.json()).then((data) => {
            form.setValue("chatTitle", data.chatTitle)
            form.setValue("chatMessagePlaceHolder", data.chatMessagePlaceHolder)

            // get the colors from the chatbot
            setBubbleColor(data.bubbleColor)
            setBubbleLogoColor(data.bubbleTextColor)
            setChatHeaderBackgroundColor(data.chatHeaderBackgroundColor)
            setChatHeaderTextColor(data.chatHeaderTextColor)
            setUserBubbleColor(data.userReplyBackgroundColor)
            setUserBubbleMessageColor(data.userReplyTextColor)
            setChatbotLogoURL(data.chatbotLogoURL)

            if (data.chatbotLogoURL) {
                setUseDefaultImage(false)
            }
        })
    }, [])

    useEffect(() => {
        if (inputFileRef.current?.files && inputFileRef.current.files.length > 0) {
            console.log(inputFileRef.current.files[0])
            setUseDefaultImage(false)
        }
    }, [inputFileRef.current?.files])

    async function onSubmit(data: z.infer<typeof customizationSchema>) {
        setIsSaving(true)

        if (!inputFileRef.current?.files) {
            throw new Error('No file selected');
        }

        const fileImage = inputFileRef.current.files[0];
        console.log(fileImage)

        const formData = new FormData();
        formData.append('chatTitle', data.chatTitle || '');
        formData.append('chatMessagePlaceHolder', data.chatMessagePlaceHolder || '');
        formData.append('bubbleColor', bubbleColor);
        formData.append('bubbleTextColor', bubbleLogoColor);
        formData.append('chatHeaderBackgroundColor', chatHeaderBackgroundColor);
        formData.append('chatHeaderTextColor', chatHeaderTextColor);
        formData.append('userReplyBackgroundColor', userBubbleColor);
        formData.append('userReplyTextColor', userBubbleMessageColor);

        if (useDefaultImage) {
            formData.set('chatbotLogoFilename', '');
            formData.set('chatbotLogo', '');
        } else if (fileImage) {
            formData.append('chatbotLogoFilename', fileImage.name);
            formData.append('chatbotLogo', fileImage);
        } else {
            formData.set('chatbotLogoFilename', 'keep-current-image');
            formData.set('chatbotLogo', '');
        }

        formData.append('useDefaultImage', String(useDefaultImage));

        const response = await fetch(`/api/chatbots/${chatbot.id}/config/customization?`, {
            method: "PATCH",
            body: formData,
        });

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
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div>
                        <h3 className="mb-4 text-lg font-medium">Chatbot Customizations</h3>
                        <div className="space-y-4">
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
                                                            <GradientPicker withGradient={false} background={userBubbleColor} setBackground={setUserBubbleColor} />
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
                                                        <div className="rounded-lg p-2" style={{ background: userBubbleColor }}>
                                                            <p className="text-md" style={{ color: userBubbleMessageColor }}>I need help with my customization what color should I choose?</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="chatbotLogo"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-left justify-between rounded-lg border p-4">
                                        <div className="space-y-4">
                                            <h1>Images</h1>
                                            <div className="flex">
                                                <div className="flex flex-col w-full justify space-y-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">
                                                            Choose chatbot image
                                                        </FormLabel>
                                                        <FormDescription>
                                                            Choose the image you want to use for your chatbot. The image used will be displayed as the chatbot profile picture.
                                                            Image size must be 32x32 pixels.
                                                        </FormDescription>
                                                        <FormControl>
                                                            <div className="space-y-2">
                                                                <Input name="file" ref={inputFileRef} type="file" onChange={
                                                                    (e) => {
                                                                        if (e.target.files && e.target.files.length > 0) {
                                                                            setUseDefaultImage(false)
                                                                        } else {
                                                                            setUseDefaultImage(true)
                                                                         }
                                                                    }
                                                                } />
                                                                <div className="flex space-x-2 flex-row">
                                                                    <Checkbox onCheckedChange={() => {
                                                                        setUseDefaultImage(!useDefaultImage)
                                                                    }} checked={useDefaultImage} ></Checkbox> <span className="text-sm text-muted-foreground">Use default chatbot image</span>
                                                                </div>
                                                            </div>
                                                        </FormControl>
                                                    </div>
                                                </div>
                                                <div className="flex w-full items-center text-center justify-center">
                                                    {chatbotLogoURL ? <Image className="boder rounded shadow" width={32} height={32} src={chatbotLogoURL} alt="chatbot logo" /> : <Icons.bot className="h-10 w-10" />}
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
            </Form>
        </div>
    )
}
