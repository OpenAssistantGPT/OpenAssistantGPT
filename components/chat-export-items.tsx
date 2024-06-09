import Link from "next/link"
import { ChatbotMessagesExport, File } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { MessagesExportOperations } from "./messages-export-operation"

interface MessagesExportProps {
    messagesExport: Pick<ChatbotMessagesExport, "id" | "blobUrl" | "createdAt" | "blobDownloadUrl" | "lastXDays">
    chatbotName: string
}

export async function ChatExportItem({ messagesExport, chatbotName }: MessagesExportProps) {

    return (
        <div className="flex items-center justify-between p-4">
            <div className="grid gap-1">
                <Link
                    href={messagesExport.blobDownloadUrl}
                    className="font-semibold hover:underline"
                >
                    {chatbotName} - {formatDate(messagesExport.createdAt.toDateString())}
                </Link>
                <div>
                    <p className="text-sm text-muted-foreground">
                        This export contains the last {messagesExport.lastXDays} days
                    </p>
                </div>
            </div>
            <MessagesExportOperations messagesExport={messagesExport} />
        </div>
    )
}

ChatExportItem.Skeleton = function FileItemSkeleton() {
    return (
        <div className="p-4">
            <div className="space-y-3">
                <Skeleton className="h-5 w-2/5" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
    )
}