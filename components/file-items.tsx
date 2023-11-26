import Link from "next/link"
import { CrawlerFile } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { CrawlerFileOperations } from "@/components/file-operations"

import { db } from "@/lib/db"

interface CrawlFileProps {
    file: Pick<CrawlerFile, "id" | "name" | "blobUrl" | "createdAt" | "crawlerId">
}

export async function CrawlerFileItem({ file }: CrawlFileProps) {

    const openAIFile = await db.openAIFile.findUnique({
        select: {
            id: true,
        },
        where: {
            fileId: file.id
        }
    })

    return (
        <div className="flex items-center justify-between p-4">
            <div className="grid gap-1">
                <Link
                    href={file.blobUrl}
                    className="font-semibold hover:underline"
                >
                    {file.name}
                </Link>
                <div>
                    {
                        openAIFile ? (
                            <p className="text-sm text-muted-foreground">
                                <span className="text-green-600">Is published</span>
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                <span className="text-red-600">Not published</span>
                            </p>
                        )
                    }
                    <p className="text-sm text-muted-foreground">
                        {formatDate(file.createdAt?.toDateString())}
                    </p>
                </div>
            </div>
            <CrawlerFileOperations file={file} />
        </div>
    )
}

CrawlerFileItem.Skeleton = function CrawledFileItemSkeleton() {
    return (
        <div className="p-4">
            <div className="space-y-3">
                <Skeleton className="h-5 w-2/5" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
    )
}