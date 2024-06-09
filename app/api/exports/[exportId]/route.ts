import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { db } from '@/lib/db';
import { z } from 'zod';

const routeContextSchema = z.object({
    params: z.object({
        exportId: z.string(),
    }),
})

async function verifyCurrentUserHasAccessToExport(exportId: string) {
    const session = await getServerSession(authOptions)


    const count = await db.chatbotMessagesExport.count({
        where: {
            id: exportId,
            chatbot: {
                userId: session?.user?.id,
            },
        },
    })

    return count > 0
}


export async function DELETE(
    request: Request,
    context: z.infer<typeof routeContextSchema>
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return new Response("Unauthorized", { status: 403 })
        }

        const { params } = routeContextSchema.parse(context)

        if (!(await verifyCurrentUserHasAccessToExport(params.exportId))) {
            return new Response(null, { status: 403 })
        }

        const messagesExport = await db.chatbotMessagesExport.findUnique({
            where: {
                id: params.exportId,
            }
        })

        if (!messagesExport) {
            return new Response(null, { status: 404 })
        }

        await del(messagesExport.blobUrl);

        await db.chatbotMessagesExport.delete({
            where: {
                id: params.exportId,
            }
        })

        return NextResponse.json({ deleted: true }, { status: 200 });
    } catch (error) {
        console.error(error)
        return new Response(null, { status: 500 })
    }

}

