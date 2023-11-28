import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { db } from "@/lib/db"
import { CrawlerPublishedFile, UploadPublishedFile } from "@/types";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response("Unauthorized", { status: 403 })
        }

        const { user } = session

        const uploadedFiles = await db.uploadFile.findMany({
            select: {
                id: true,
                name: true,
                blobUrl: true,
                createdAt: true,
                userId: true,
                OpenAIFile: {
                    select: {
                        id: true,
                        openAIFileId: true,
                    }
                }
            },
            where: {
                userId: user.id,
                OpenAIFile: {
                    some: {}
                }
            },
        })

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
                        OpenAIFile: {
                            select: {
                                id: true,
                                openAIFileId: true,
                            }
                        }
                    }

                }
            },
            where: {
                userId: user.id,
            },
        })

        const crawlerPublishedFiles: CrawlerPublishedFile[] = []

        for (const crawler of crawlers) {
            for (const crawlerFile of crawler.crawlerFile) {
                for (const publishedFile of crawlerFile.OpenAIFile) {
                    crawlerPublishedFiles.push({
                        crawlerFileId: crawlerFile.id,
                        openAIFileId: publishedFile.openAIFileId,
                        name: crawlerFile.name,
                    })

                }
            }
        }

        const uploadPublishedFiles: UploadPublishedFile[] = []

        for (const uploadedFile of uploadedFiles) {
            uploadPublishedFiles.push({
                uploadFileId: uploadedFile.id,
                openAIFileId: uploadedFile.OpenAIFile[0].openAIFileId,
                name: uploadedFile.name,
            })
        }

        const returnValue = {
            "crawlerPublishedFiles": crawlerPublishedFiles,
            "uploadPublishedFiles": uploadPublishedFiles,
        }
        console.log(returnValue)

        return new Response(JSON.stringify(returnValue))
    } catch (error) {
        return new Response(null, { status: 500 })
    }
}