import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { RequiresHigherPlanError } from "@/lib/exceptions";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { customizationStringBackendSchema } from "@/lib/validations/customization";
import { put } from "@vercel/blob";
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
        const session = await getServerSession(authOptions)
        const { params } = routeContextSchema.parse(context)

        if (!(await verifyCurrentUserHasAccessToChatbot(params.chatbotId))) {
            return new Response(null, { status: 403 })
        }

        const subscriptionPlan = await getUserSubscriptionPlan(session?.user?.id || '')

        if (subscriptionPlan.basicCustomization === false) {
            throw new RequiresHigherPlanError()
        }

        const formData = await req.formData();
        const payload = customizationStringBackendSchema.parse(Object.fromEntries(formData));

        let blob = undefined
        if (payload.chatbotLogoFilename !== '' && payload.chatbotLogoFilename !== 'keep-current-image' && payload.chatbotLogo !== '') {
            blob = await put(payload.chatbotLogoFilename || "", payload.chatbotLogo, {
                access: 'public',
            });
            console.log(blob)
        }   

        const currentChatbot = await db.chatbot.findUnique({
            where: {
                id: params.chatbotId,
            },
            select: {
                chatbotLogoURL: true,
            },
        });

        const chatbot = await db.chatbot.update({
            where: {
                id: params.chatbotId,
            },
            data: {
                chatTitle: payload.chatTitle,
                chatMessagePlaceHolder: payload.chatMessagePlaceHolder,
                bubbleColor: payload.bubbleColor,
                bubbleTextColor: payload.bubbleTextColor,
                chatHeaderBackgroundColor: payload.chatHeaderBackgroundColor,
                chatHeaderTextColor: payload.chatHeaderTextColor,
                userReplyBackgroundColor: payload.userReplyBackgroundColor,
                userReplyTextColor: payload.userReplyTextColor,
                chatbotLogoURL: blob ? blob.url : payload.chatbotLogoFilename === 'keep-current-image' ? currentChatbot?.chatbotLogoURL : '',
            },
            select: {
                id: true,
                name: true,
                displayBranding: true,
            },
        });

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