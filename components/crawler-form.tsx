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
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface CrawlerFormProps extends React.HTMLAttributes<HTMLFormElement> {
    crawler: Pick<Crawler, "id" | "name" | "crawlUrl" | "selector" | "urlMatch">
}

type FormData = z.infer<typeof crawlerSchema>

export function CrawlerForm({ crawler, className, ...props }: CrawlerFormProps) {
    const router = useRouter()
    const form = useForm<FormData>({
        resolver: zodResolver(crawlerSchema),
        defaultValues: {
            name: crawler?.name || "",
            crawlUrl: crawler?.crawlUrl || "",
            selector: crawler?.selector || "",
            urlMatch: crawler?.urlMatch || "",
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
        <Form {...form}>
            <form
                className={cn(className)}
                onSubmit={form.handleSubmit(onSubmit)}
                {...props}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Crawlers settings</CardTitle>
                        <CardDescription>
                            Update your crawler configuration.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="name">
                                        Display Name
                                    </FormLabel>
                                    <Input
                                        defaultValue={crawler?.name || ""}
                                        onChange={field.onChange}
                                        id="name"
                                    />
                                    <FormDescription>
                                        The name that will be displayed in the dashboard
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="crawlUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="crawlUrl">
                                        Crawling URL
                                    </FormLabel>
                                    <Input
                                        defaultValue={crawler?.crawlUrl || ""}
                                        onChange={field.onChange}
                                        id="crawlUrl"
                                    />
                                    <FormDescription>
                                        The URL that we will start the crawling on. Make sure the URL starts with the protocol https:// or http://
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="urlMatch"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="urlmatch">
                                        URL Match
                                    </FormLabel >
                                    <Input
                                        defaultValue={crawler?.urlMatch || ""}
                                        onChange={field.onChange}
                                        id="urlmatch"
                                    />
                                    <FormDescription>
                                        When we crawl we will make sure to always match with this string.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="selector"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="selector">
                                        Selector
                                    </FormLabel>
                                    <Input
                                        defaultValue={crawler?.selector || ""}
                                        onChange={field.onChange}
                                        id="selector"
                                    />
                                    <FormDescription>
                                        The selector will be used by the query selector to get the content from a specific part of the website. You can test your query selector when you open your website with F12 in the console and do this: document.querySelector(&quot;[id=&apos;root&apos;]&quot;).
                                        If you want to extract all the content simply use: &apos;body&apos;
                                    </FormDescription>
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
        </Form >
    )
}