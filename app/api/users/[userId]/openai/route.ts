import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { openAIConfigSchema } from "@/lib/validations/openaiConfig"
import OpenAI from "openai"

const routeContextSchema = z.object({
    params: z.object({
        userId: z.string(),
    }),
})

export async function PATCH(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {
    try {
        // Validate the route context.
        const { params } = routeContextSchema.parse(context)

        // Ensure user is authentication and has access to this user.
        const session = await getServerSession(authOptions)
        if (!session?.user || params.userId !== session?.user.id) {
            return new Response(null, { status: 403 })
        }

        // Get the request body and validate it.
        const body = await req.json()
        const payload = openAIConfigSchema.parse(body)

        try {
            const openai = new OpenAI({
                apiKey: payload.globalAPIKey
            })
            await openai.models.list()
        } catch (error) {
            return new Response("Invalid OpenAI API key", { status: 400, statusText: "Invalid OpenAI API key" })
        }

        // Update the user.
        await db.openAIConfig.upsert({
            where: {
                userId: session.user.id,
            },
            create: {
                userId: session.user.id,
                ...payload
            },
            update: {
                ...payload
            }
        })
        return new Response(null, { status: 200 })
    } catch (error) {
        console.error(error)
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 })
        }

        return new Response(null, { status: 500 })
    }
}

export async function GET(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {
    try {
        // Validate the route context.
        const { params } = routeContextSchema.parse(context)

        // Ensure user is authenticated and has access to this user.
        const session = await getServerSession(authOptions)
        if (!session?.user || params.userId !== session?.user.id) {
            return new Response(null, { status: 403 })
        }

        // Fetch the user's global API key from the OpenAIConfig model.
        const openAIConfig = await db.openAIConfig.findUnique({
            where: {
                userId: session.user.id,
            },
            select: {
                globalAPIKey: true,
            },
        })

        if (!openAIConfig) {
            return new Response(null, { status: 404 })
        }

        return new Response(JSON.stringify({ globalAPIKey: openAIConfig.globalAPIKey }), { status: 200 })
    } catch (error) {
        console.error(error)
        return new Response(null, { status: 500 })
    }
}