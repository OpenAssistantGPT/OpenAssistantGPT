import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { db } from "@/lib/db"

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response("Unauthorized", { status: 403 })
        }

        const { user } = session

        const files = await db.file.findMany({
            select: {
                id: true,
                name: true,
                blobUrl: true,
                openAIFileId: true,
                createdAt: true,
            },
            where: {
                userId: user?.id,
            },
        })

        return new Response(JSON.stringify(files))
    } catch (error) {
        return new Response(null, { status: 500 })
    }
}