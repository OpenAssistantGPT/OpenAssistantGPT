
import { notFound, redirect } from "next/navigation"

import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { CrawlerFileItem } from "@/components/crawler-file-items"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CrawlerCreateButton } from "@/components/crawler-create-button"
import { FileUploadButton } from "@/components/file-upload-button"
import { UploadFileItem } from "@/components/upload-file-items"


export default async function FilePage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const crawlers = await db.crawler.findMany({
        select: {
            id: true,
            name: true,
            createdAt: true,
            crawlerFile: {
                select: {
                    id: true,
                    name: true,
                    blobUrl: true,
                    createdAt: true,
                    crawlerId: true,
                }
            }
        },
        where: {
            userId: user.id,
        },
    })

    const uploadedFiles = await db.uploadFile.findMany({
        select: {
            id: true,
            name: true,
            blobUrl: true,
            createdAt: true,
            userId: true,
        },
        where: {
            userId: user.id,
        },
    })


    return (
        <DashboardShell>
            <DashboardHeader heading="Files" text="List of all of your crawled file">
            </DashboardHeader>
            <div className="flex flex-col">
                <div className="mb-4 flex items-center justify-between px-2">
                    <Label className="text-lg">Uploaded files</Label>
                    <FileUploadButton variant={"outline"} />
                </div>
                {uploadedFiles.length ?
                    <div className="divide-y divide-border rounded-md border">
                        {uploadedFiles.map((file) => (
                            <UploadFileItem key={file.id} file={file} />
                        ))
                        }
                    </div>
                    : <div className="grid gap-10">
                        <EmptyPlaceholder>
                            <EmptyPlaceholder.Icon name="folder" />
                            <EmptyPlaceholder.Title>Import a file now</EmptyPlaceholder.Title>
                            <EmptyPlaceholder.Description>
                                You don&apos;t have any files yet. Import a file.
                            </EmptyPlaceholder.Description>
                            <FileUploadButton variant={"outline"} />
                        </EmptyPlaceholder>
                    </div>
                }
                <div className="my-4" />
                <div className="mb-4 flex items-center justify-between px-2">
                    <Label className="text-lg">Crawlers&apos; files</Label>
                    <CrawlerCreateButton variant={"outline"} />
                </div>
                {crawlers?.length ?
                    <div className="divide-y divide-border rounded-md border">
                        {
                            crawlers.map((crawler) => (
                                crawler.crawlerFile.map((file) => (
                                    <CrawlerFileItem file={file} key={file.id} />
                                ))
                            ))
                        }
                    </div>
                    :
                    <div className="grid gap-10">
                        <EmptyPlaceholder>
                            <EmptyPlaceholder.Icon name="laptop" />
                            <EmptyPlaceholder.Title>Start crawling now to import files</EmptyPlaceholder.Title>
                            <EmptyPlaceholder.Description>
                                You don&apos;t have any files yet. Start crawling.
                            </EmptyPlaceholder.Description>
                            <CrawlerCreateButton variant={"outline"} />
                        </EmptyPlaceholder>
                    </div>

                }
            </div>
        </DashboardShell>
    )
}