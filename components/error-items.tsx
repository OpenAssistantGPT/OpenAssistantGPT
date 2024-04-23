import { ChatbotErrors } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorOperations } from "@/components/error-operations"


interface UploadFileProps {
    error: Pick<ChatbotErrors, "id" | "chatbotId" | "createdAt" | "errorMessage" | "threadId">
}

export async function ErrorItem({ error }: UploadFileProps) {

    return (
        <div className="flex items-center justify-between p-4">
            <div className="grid gap-1 w-5/6">
                <div>
                    <p>
                        Thread ID: {error.threadId}
                    </p>
                    <p>
                        Date: {formatDate(error.createdAt?.toDateString())}
                    </p>
                </div>
                <p className="text-sm text-muted-foreground">
                    {error.errorMessage}
                </p>
            </div>
            <ErrorOperations error={error} />
        </div>
    )
}

ErrorItem.Skeleton = function ErrorItemSkeleton() {
    return (
        <div className="p-4">
            <div className="space-y-3">
                <Skeleton className="h-5 w-2/5" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
    )
}