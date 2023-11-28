import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { fileUploadSchema } from '@/lib/validations/fileUpload';
import { ConstructionIcon } from 'lucide-react';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new Response("Unauthorized", { status: 403 })
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
        return new Response('Missing filename', { status: 400 });
    }

    if (!request.body) {
        return new Response('Missing body', { status: 400 });
    }

    const blob = await put(filename, request.body, {
        access: 'public',
    });

    await db.UploadFile.create({
        data: {
            name: filename,
            blobUrl: blob.url,
            userId: session?.user?.id,
        }
    })

    return NextResponse.json({ url: blob.url }, { status: 201 });
}