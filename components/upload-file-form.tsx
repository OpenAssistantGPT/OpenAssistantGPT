"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { fileUploadSchema } from "@/lib/validations/fileUpload"
import { useRef } from "react"

interface UploadFileFormProps extends React.HTMLAttributes<HTMLFormElement> { }

type FormData = z.infer<typeof fileUploadSchema>

export function UploadFileForm({ className, ...props }: UploadFileFormProps) {
    const router = useRouter()
    const inputFileRef = useRef<HTMLInputElement>(null);

    const form = useForm<FormData>({
        resolver: zodResolver(fileUploadSchema),
    })
    const [isSaving, setIsSaving] = React.useState<boolean>(false)

    async function onSubmit(data: FormData) {
        setIsSaving(true)

        if (!inputFileRef.current?.files) {
            throw new Error('No file selected');
        }

        const file = inputFileRef.current.files[0];

        const response = await fetch(`/api/upload?filename=${file.name}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: file,
        })

        setIsSaving(false)

        if (!response?.ok) {
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
                description: "Your file was not uploaded. Please try again.",
                variant: "destructive",
            })
        }

        toast({
            description: "Your file has been uploaded.",
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
                        <CardTitle>Upload File</CardTitle>
                        <CardDescription>
                            Upload a file to be used for training.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="file">
                                        File
                                    </FormLabel>
                                    <Input
                                        type="file"
                                        ref={inputFileRef}
                                        onChange={field.onChange}
                                        id="file"
                                    />
                                    <FormDescription>
                                        the file to be used for training.
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
                            <span>Upload</span>
                        </button>
                    </CardFooter>
                </Card>
            </form>
        </Form >
    )
}