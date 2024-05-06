"use client"

import format from "date-fns/format"
import {
    Trash2,
} from "lucide-react"

import {
    Avatar,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "./ui/use-toast"
import { useRouter } from "next/navigation"
import { InquiryMessages } from "@/types"
import { ScrollArea } from "@/components/ui/scroll-area"

interface InquiryDisplayProps {
    inquiry: InquiryMessages | undefined
}

export function InquiryDisplay({ inquiry }: InquiryDisplayProps) {
    const router = useRouter()

    async function deleteInquiry() {
        console.log(inquiry)
        if (inquiry) {
            const response = await fetch(`/api/chatbots/${inquiry.chatbotId}/inquiries/${inquiry.id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                toast(
                    {
                        title: "Inquiry deleted",
                        description: "The inquiry has been successfully deleted",
                    }
                )
            } else {
                toast(
                    {
                        title: "Inquiry not deleted",
                        description: "The inquiry could not be deleted",
                        variant: "destructive"
                    }
                )
            }
            router.refresh()
        }
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center p-2">
                <div className="flex items-center gap-2">
                </div>
                <div className="ml-auto flex items-center gap-2 pr-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button onClick={deleteInquiry} variant="ghost" size="icon" disabled={!inquiry}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                </div>
            </div>
            <Separator />
            {inquiry ? (
                <div className="flex flex-1 flex-col">
                    <div className="flex items-start p-4">
                        <div className="flex items-start gap-4 text-sm">
                            <Avatar>
                                <AvatarImage alt={inquiry.email} />
                            </Avatar>
                            <div className="grid gap-1">
                                <div className="font-semibold">{inquiry.email}</div>
                                <div className="line-clamp-1 text-xs">{inquiry.createdAt.toISOString()}</div>
                                <div className="line-clamp-1 text-xs">
                                    <span className="font-medium">Thread Id:</span> {inquiry.threadId}
                                </div>
                            </div>
                        </div>
                        {inquiry.createdAt && (
                            <div className="ml-auto text-xs text-muted-foreground">
                                {format(new Date(inquiry.createdAt), "PPpp")}
                            </div>
                        )}
                    </div>
                    <Separator />

                    <ScrollArea style={{ height: "70vh" }}>
                        <div className="flex-1 whitespace-pre-wrap space-y-4 p-4 text-sm">
                            <div className="flex items-center p-4 text-sm text-gray-800 border border-gray-300 rounded-lg bg-gray-50" role="alert">
                                <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                </svg>
                                <span className="sr-only">Info</span>
                                <div>
                                    <span className="font-medium">Your client question: </span> {inquiry.inquiry}
                                </div>
                            </div>
                            {inquiry.messages.map((message: any) => {
                                return (
                                    <div key={message.id} className="space-y-4">
                                        <div className="flex max-w-5/6 items-end gap-2 justify-end" >
                                            <div className="rounded-lg flex max-w-5/6 bg-blue-500 text-white p-2 self-end">
                                                <p className="text-md" >{message.message}</p>
                                            </div>
                                        </div>
                                        <div key="welcomemessage" className="flex items-end gap-2">
                                            <div className="rounded-lg bg-zinc-200 p-2">
                                                <p className="text-md">{message.response}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                    </ScrollArea>
                </div>
            ) : (
                <div className="p-8 text-center text-muted-foreground">
                    No message selected
                </div>
            )
            }
        </div >
    )
}