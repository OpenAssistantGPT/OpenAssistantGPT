"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Crawler } from "@prisma/client"
import { useState } from "react"
import { toast } from "./ui/use-toast"

interface CrawlingProps extends React.HTMLAttributes<HTMLFormElement> {
    crawler: Pick<Crawler, "id" | "name" | "crawlUrl" | "selector" | "urlMatch">
}

export function StartCrawlingButton({
    className,
    crawler,
    ...props
}: CrawlingProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function onClick() {
        setIsLoading(true)

        const response = await fetch(`/api/crawlers/${crawler.id}/crawling`)

        if (!response?.ok) {
            setIsLoading(false)
            if (response.status === 400) {
                return toast({
                    title: "Invalid request",
                    description: await response.text(),
                    variant: "destructive",
                })
            }
            if (response.status === 402) {
                return toast({
                    title: "File limit reached.",
                    description: "Please upgrade to the a higher plan.",
                    variant: "destructive",
                })
            }
            return toast({
                title: "Something went wrong.",
                description: "Your crawling failed. Please try again.",
                variant: "destructive",
            })
        }

        toast({
            description: "Crawling finished.",
        })

        setIsLoading(false)
        router.refresh()
    }

    return (
        <>
            <button
                onClick={onClick}
                className={cn(
                    buttonVariants("default"),
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
                Start crawling now
            </button>
        </>
    )
}