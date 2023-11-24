"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Chatbot } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { chatbotSchema } from "@/lib/validations/chatbot"
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
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface ChatbotFormProps extends React.HTMLAttributes<HTMLFormElement> {
    chatbot: Pick<Chatbot, "id" | "name" | "openaiKey" | "modelId" | "createdAt" | "welcomeMessage" | "prompt" | "draft">
}

type FormData = z.infer<typeof chatbotSchema>

export function ChatbotForm({ chatbot, className, ...props }: ChatbotFormProps) {
    const router = useRouter()
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(chatbotSchema),
        defaultValues: {
            name: chatbot?.name || "",
            openAIKey: chatbot?.openaiKey || "",
            modelId: chatbot?.modelId || "",
            welcomeMessage: chatbot?.welcomeMessage || "",
            prompt: chatbot?.prompt || ""
        },
    })
    const [isSaving, setIsSaving] = React.useState<boolean>(false)

    async function onSubmit(data: FormData) {
        console.log(data)
        setIsSaving(true)

        const response = await fetch(`/api/chatbots/${chatbot.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
                openaiKey: data.openAIKey,
                modelId: data.modelId,
                welcomeMessage: data.welcomeMessage,
                prompt: data.prompt
            }),
        })

        setIsSaving(false)

        if (!response?.ok) {
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
        <form
            className={cn(className)}
            onSubmit={handleSubmit(onSubmit)}
            {...props}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Chatbot settings</CardTitle>
                    <CardDescription>
                        Configure your chatbot.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-1 mb-4">
                        <Label htmlFor="name">
                            Display Name
                        </Label>
                        <Input
                            id="name"
                            className="w-[400px]"
                            size={32}
                            {...register("name")}
                        />
                        {errors?.name && (
                            <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="grid gap-1 mb-4">
                        <Label htmlFor="openAIKey">
                            OpenAI Key
                        </Label>
                        <Input
                            id="openAIKey"
                            type="password"
                            className="w-[400px]"
                            size={32}
                            {...register("openAIKey")}
                        />
                        {errors?.openAIKey && (
                            <p className="px-1 text-xs text-red-600">{errors.openAIKey.message}</p>
                        )}
                    </div>
                    <div className="grid gap-1 mb-4">
                        <Label htmlFor="modelId">
                            Model ID
                        </Label>
                        <Input
                            id="modelId"
                            className="w-[400px]"
                            size={32}
                            {...register("modelId")}
                        />
                        {errors?.modelId && (
                            <p className="px-1 text-xs text-red-600">{errors.modelId.message}</p>
                        )}
                    </div>
                    <div className="grid gap-1 mb-4">
                        <Label htmlFor="welcomeMessage">
                            Welcome Message
                        </Label>
                        <Input
                            id="welcomeMessage"
                            className="w-[400px]"
                            size={32}
                            {...register("welcomeMessage")}
                        />
                        {errors?.welcomeMessage && (
                            <p className="px-1 text-xs text-red-600">{errors.welcomeMessage.message}</p>
                        )}
                    </div>
                    <div className="grid gap-1 mb-4">
                        <Label htmlFor="prompt">
                            Prompt
                        </Label>
                        <Input
                            id="prompt"
                            className="w-[400px]"
                            size={32}
                            {...register("prompt")}
                        />
                        {errors?.prompt && (
                            <p className="px-1 text-xs text-red-600">{errors.prompt.message}</p>
                        )}
                    </div>
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
    )
}