import Link from "next/link"
import { Chatbot, ChatbotModel } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ChatbotOperations } from "./chatbot-operations"

interface ChatbotProps {
    chatbot: Pick<Chatbot, "id" | "name" | "createdAt" | "modelId">
    model: ChatbotModel,
    isPublished: boolean
}

export function ChatbotItem({ chatbot, model, isPublished }: ChatbotProps) {
    return (
        <div className="flex items-center justify-between p-4">
            <div className="grid gap-1">
                <Link
                    href={`/dashboard/chatbots/${chatbot.id}`}
                    className="font-semibold hover:underline"
                >
                    {chatbot.name}
                </Link>
                <div>
                    <p className="text-sm text-muted-foreground">
                        {model.name}
                    </p>
                    {
                        isPublished ? (
                            <p className="text-green-600 text-sm text-muted-foreground">
                                Is Published
                            </p>
                        ) : (
                            <p className="text-red-600 text-sm text-muted-foreground">
                                Not published
                            </p>
                        )
                    }
                    <p className="text-sm text-muted-foreground">
                        {formatDate(chatbot.createdAt?.toDateString())}
                    </p>
                </div>
            </div>
            <ChatbotOperations chatbot={chatbot} />
        </div>
    )
}

ChatbotItem.Skeleton = function CrawledFileItemSkeleton() {
    return (
        <div className="p-4">
            <div className="space-y-3">
                <Skeleton className="h-5 w-2/5" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
    )
}