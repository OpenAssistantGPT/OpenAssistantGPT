"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Crawler } from "@prisma/client"
import { useState } from "react"





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

        await fetch(`/api/crawlers/${crawler.id}/crawling`)

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