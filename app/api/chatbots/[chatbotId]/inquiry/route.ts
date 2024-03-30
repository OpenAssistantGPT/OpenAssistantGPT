import { db } from "@/lib/db";
import { RequiresHigherPlanError } from "@/lib/exceptions";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { inquirySchema } from "@/lib/validations/inquiry";
import { z } from "zod"


const routeContextSchema = z.object({
    params: z.object({
        chatbotId: z.string(),
    }),
})

export async function OPTIONS(req: Request) {
    return new Response('Ok', { status: 200 })
}

export async function POST(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {
    try {
        const { params } = routeContextSchema.parse(context)

        const body = await req.json();
        const payload = inquirySchema.parse(body)

        console.log(payload)

        const chatbot = await db.chatbot.findUnique({
            where: {
                id: params.chatbotId,
            },
            select: {
                id: true,
                userId: true,
            },
        })

        if (!chatbot) {
            return new Response(null, { status: 404 });
        }


        // if there is already a support case for the threadid and same chatbot return
        const existingInquiry = await db.clientInquiries.findFirst({
            where: {
                chatbotId: params.chatbotId,
                threadId: payload.threadId,
            },
        })
        if (existingInquiry) {
            return new Response('Already exist', { status: 409 });
        }

        //const subscriptionPlan = await getUserSubscriptionPlan(chatbot.userId || '')

        //if (subscriptionPlan.basicCustomization === false) {
        //    throw new RequiresHigherPlanError()
        //}

        const id = await db.clientInquiries.create({
            data: {
                chatbotId: params.chatbotId,
                threadId: payload.threadId,
                email: payload.email,
                inquiry: payload.inquiry,
            },
            select: {
                id: true,
            },
        })

        return new Response(JSON.stringify({ 'id': id }), { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response(null, { status: 500 });
    }
}
