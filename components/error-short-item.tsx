import Link from "next/link"
import { ChatbotErrors } from "@prisma/client"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"

interface UploadFileProps {
    error: Pick<ChatbotErrors, "id" | "chatbotId" | "errorMessage" | "threadId" | "createdAt">
    chatbotName: string
}

export async function ErrorShortItem({ error, chatbotName }: UploadFileProps) {

    return (
        <Link href={`/dashboard/chatbots/${error.chatbotId}/errors`}>
            <button
                key={error.id}
                className={cn(
                    "flex flex-col w-full items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                )}
            >
                <div className="flex w-full flex-col gap-1">
                    <div className="flex items-center">
                        <div className="flex items-center gap-2">
                            <div className="font-semibold">{chatbotName}</div>
                        </div>
                        <div
                            className="ml-auto text-xs"
                        >
                            {formatDistanceToNow(new Date(error.createdAt), {
                                addSuffix: true,
                            })}
                        </div>
                    </div>
                    <div className="text-xs font-medium">{error.threadId}</div>
                </div>
                <div className="line-clamp-2 break-all text-xs text-muted-foreground">
                    {error.errorMessage.substring(0, 300)}
                </div>
            </button>
        </Link>
    )
}

ErrorShortItem.Skeleton = function ErrorShortItemSkeleton() {
    return (
        <div className="p-4">
            <div className="space-y-3">
                <Skeleton className="h-5 w-2/5" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
    )
}