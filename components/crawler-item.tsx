import Link from "next/link"
import { Crawler } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { CrawlerOperations } from "@/components/crawler-operations"

interface CrawlerItemProps {
    crawler: Pick<Crawler, "id" | "name" | "crawlUrl" | "createdAt">
}

export function CrawlerItem({ crawler }: CrawlerItemProps) {
    return (
        <div className="flex items-center justify-between p-4">
            <div className="grid gap-1">
                <Link
                    href={`/dashboard/crawlers/${crawler.id}`}
                    className="font-semibold hover:underline"
                >
                    {crawler.name}
                </Link>
                <div>
                    <p className="text-sm text-muted-foreground">
                        {crawler.crawlUrl}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {formatDate(crawler.createdAt?.toDateString())}
                    </p>
                </div>
            </div>
            <CrawlerOperations crawler={{ id: crawler.id, name: crawler.name }} />
        </div>
    )
}

CrawlerItem.Skeleton = function CrawltemSkeleton() {
    return (
        <div className="p-4">
            <div className="space-y-3">
                <Skeleton className="h-5 w-2/5" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
    )
}