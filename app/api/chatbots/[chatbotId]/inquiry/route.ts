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

        //db.clientInquiries.create({
        //    data: {
        //        body.chatbotId,
        //        body.threadId,
        //        body.name,
        //        body.email,
        //        body.inquiry,
        //    },
        //    select: {
        //        id: true,
        //    },
        //})
        return new Response("returned", { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response(null, { status: 500 });
    }
}
