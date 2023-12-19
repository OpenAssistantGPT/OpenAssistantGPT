"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { toast } from "./ui/use-toast"
import { Icons } from "@/components/icons"

interface ChatbotCreateButtonProps extends ButtonProps { }

export function ChatbotCreateButton({
    className,
    variant,
    ...props
}: ChatbotCreateButtonProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    async function GetFiles() {
        const files = await fetch(`/api/files`)
        return await files.json()
    }

    async function onClick() {
        setIsLoading(true)

        const files = await GetFiles()

        if (files.length === 0) {
            toast({
                title: "No file found.",
                description: "Please upload a file first or create a crawler to import content.",
                variant: "destructive",
            })
            setIsLoading(false)
            return
        }

        router.refresh()

        router.push(`/dashboard/new/chatbot`)
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                buttonVariants({ variant }),
                {
                    "cursor-not-allowed opacity-60": isLoading,
                },
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Icons.add className="mr-2 h-4 w-4" />
            )}
            New Chatbot
        </button>
    )
}