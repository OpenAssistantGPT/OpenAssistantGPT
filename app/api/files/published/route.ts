import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { db } from "@/lib/db"
import { PublishedFile } from "@/types";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response("Unauthorized", { status: 403 })
        }

        const { user } = session
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

        const publishedFiles: PublishedFile[] = []

        for (const crawler of crawlers) {
            for (const crawlerFile of crawler.crawlerFile) {
                for (const publishedFile of crawlerFile.OpenAIFile) {
                    publishedFiles.push({
                        crawlerFileId: crawlerFile.id,
                        openAIFileId: publishedFile.openAIFileId,
                        name: crawlerFile.name,
                    })

                }
            }
        }
        return new Response(JSON.stringify(publishedFiles))
    } catch (error) {
        return new Response(null, { status: 500 })
    }
}