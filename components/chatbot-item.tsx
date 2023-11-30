import Link from "next/link"
import { Chatbot, ChatbotModel } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ChatbotOperations } from "./chatbot-operations"

interface ChatbotProps {
    chatbot: Pick<Chatbot, "id" | "name" | "createdAt" | "modelId" | "openaiId">
    model: ChatbotModel,
}

export function ChatbotItem({ chatbot, model }: ChatbotProps) {
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
                    <p className="text-sm text-muted-foreground">
                        {chatbot.openaiId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {formatDate(chatbot.createdAt?.toDateString())}
                    </p>
                </div>
            </div>
            <ChatbotOperations chatbot={chatbot} />
        </div>
    )
}

ChatbotItem.Skeleton = function ChatbotFileItemSkeleton() {
    return (
        <div className="p-4">
            <div className="space-y-3">
                <Skeleton className="h-5 w-2/5" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
    )
}