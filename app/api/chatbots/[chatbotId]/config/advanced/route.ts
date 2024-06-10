import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { RequiresHigherPlanError } from "@/lib/exceptions";
import { advancedSettingsSchema } from "@/lib/validations/advancedSettings";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { z } from "zod";

const routeContextSchema = z.object({
    params: z.object({
        chatbotId: z.string(),
    }),
})

async function verifyCurrentUserHasAccessToChatbot(chatbotId: string) {
    const session = await getServerSession(authOptions)

    const count = await db.chatbot.count({
        where: {
            id: chatbotId,
            userId: session?.user?.id,
        },
    })

    return count > 0
}

export async function PATCH(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {
    try {
        const { params } = routeContextSchema.parse(context)

        if (!(await verifyCurrentUserHasAccessToChatbot(params.chatbotId))) {
            return new Response(null, { status: 403 })
        }

        const body = await req.json()
        const payload = advancedSettingsSchema.parse(body)

        if (payload.maxCompletionTokens && payload.maxCompletionTokens <= 255) {
            return new Response("Max completion tokens must be at least 256", { status: 400 })
        }

        if (payload.maxPromptTokens && payload.maxPromptTokens <= 255) {
            return new Response("Max prompt tokens must be at least 256", { status: 400 })
        }


        const chatbot = await db.chatbot.update({
            where: {
                id: params.chatbotId
            },
            data: {
                maxCompletionTokens: payload.maxCompletionTokens || null,
                maxPromptTokens: payload.maxPromptTokens || null,
            },
            select: {
                id: true,
                name: true,
            },
        })

        return new Response(JSON.stringify(chatbot))
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 })
        }

        if (error instanceof RequiresHigherPlanError) {
            return new Response("Requires Higher Plan", { status: 402 })
        }

        return new Response(null, { status: 500 })
    }
}