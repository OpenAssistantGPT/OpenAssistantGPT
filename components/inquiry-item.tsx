import Link from "next/link"
import { ClientInquiries } from "@prisma/client"

import { cn, formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"

interface UploadFileProps {
    inquiry: Pick<ClientInquiries, "id" | "chatbotId" | "email" | "createdAt" | "inquiry" | "threadId">
}

export async function InquiryItem({ inquiry }: UploadFileProps) {

    return (
        <Link href={`/dashboard/chatbots/${inquiry.chatbotId}/inquiries`}>
            <button
                key={inquiry.id}
                className={cn(
                    "flex flex-col w-full items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                )}
            >
                <div className="flex w-full flex-col gap-1">
                    <div className="flex items-center">
                        <div className="flex items-center gap-2">
                            <div className="font-semibold">{inquiry.email}</div>
                        </div>
                        <div
                            className="ml-auto text-xs"
                        >
                            {formatDistanceToNow(new Date(inquiry.createdAt), {
                                addSuffix: true,
                            })}
                        </div>
                    </div>
                    <div className="text-xs font-medium">{inquiry.threadId}</div>
                </div>
                <div className="line-clamp-2 break-all text-xs text-muted-foreground">
                    {inquiry.inquiry.substring(0, 100)}
                </div>
            </button>
        </Link>
    )
}

InquiryItem.Skeleton = function FileItemSkeleton() {
    return (
        <div className="p-4">
            <div className="space-y-3">
                <Skeleton className="h-5 w-2/5" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
    )
}