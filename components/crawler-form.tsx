
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Crawler } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { crawlerSchema } from "@/lib/validations/crawler"
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

interface CrawlerFormProps extends React.HTMLAttributes<HTMLFormElement> {
    crawler: Pick<Crawler, "id" | "name" | "crawlUrl" | "selector" | "urlMatch">
}

type FormData = z.infer<typeof crawlerSchema>

export function CrawlerForm({ crawler, className, ...props }: CrawlerFormProps) {
    const router = useRouter()
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(crawlerSchema),
        defaultValues: {
            name: crawler?.name || "",
            crawlUrl: crawler?.crawlUrl || "",
            selector: crawler?.selector || "",
            urlMatch: crawler?.urlMatch || ""
        },
    })
    const [isSaving, setIsSaving] = React.useState<boolean>(false)

    async function onSubmit(data: FormData) {
        setIsSaving(true)

        const response = await fetch(`/api/crawlers/${crawler.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
                crawlUrl: data.crawlUrl,
                selector: data.selector,
                urlMatch: data.urlMatch
            }),
        })

        setIsSaving(false)

        if (!response?.ok) {
            return toast({
                title: "Something went wrong.",
                description: "Your crawler was not updated. Please try again.",
                variant: "destructive",
            })
        }

        toast({
            description: "Your crawler has been updated.",
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
                    <CardTitle>Crawlers settings</CardTitle>
                    <CardDescription>
                        Configure your crawler.
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
                        <Label htmlFor="crawlUrl">
                            Crawling URL
                        </Label>
                        <Input
                            id="crawlUrl"
                            className="w-[400px]"
                            {...register("crawlUrl")}
                        />
                        {errors?.name && (
                            <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="grid gap-1 mb-4">
                        <Label htmlFor="urlmatch">
                            URL Match
                        </Label>
                        <Input
                            id="urlmatch"
                            className="w-[400px]"
                            {...register("urlMatch")}
                        />
                        {errors?.name && (
                            <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="grid gap-1">
                        <Label htmlFor="selector">
                            Selector
                        </Label>
                        <Input
                            id="selector"
                            className="w-[400px]"
                            {...register("selector")}
                        />
                        {errors?.name && (
                            <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
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