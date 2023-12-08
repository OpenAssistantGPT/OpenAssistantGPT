import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { db } from '@/lib/db';
import OpenAI from 'openai';
import { getUserSubscriptionPlan } from '@/lib/subscription';
import { RequiresHigherPlanError } from '@/lib/exceptions';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return new Response("Unauthorized", { status: 403 })
        }

        // Validate user subscription plan
        const { user } = session
        const subscriptionPlan = await getUserSubscriptionPlan(user.id)

        const count = await db.file.count({
            where: {
                userId: user.id,
            },
        })

        if (count >= subscriptionPlan.maxFiles) {
            throw new RequiresHigherPlanError()
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

        const openAIConfig = await db.openAIConfig.findUnique({
            select: {
                globalAPIKey: true,
                id: true,
            },
            where: {
                userId: session?.user?.id
            }
        })

        if (!openAIConfig?.globalAPIKey) {
            return new Response("Missing OpenAI API key", { status: 403 })
        }

        const openai = new OpenAI({
            apiKey: openAIConfig?.globalAPIKey
        })

        const file = await openai.files.create(
            { file: await fetch(blob.url), purpose: 'assistants' }
        )

        await db.file.create({
            data: {
                name: filename,
                blobUrl: blob.url,
                openAIFileId: file.id,
                userId: session?.user?.id,
            }
        })

        return NextResponse.json({ url: blob.url }, { status: 201 });
    } catch (error) {
        console.error(error);

        if (error instanceof RequiresHigherPlanError) {
            return new Response("Requires Pro Plan", { status: 402 })
        }

        return new Response(null, { status: 500 })
    }
}