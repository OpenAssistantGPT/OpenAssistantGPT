import { db } from "@/lib/db"

export async function GET(request: Request) {
    try {

        const models = await db.chatbotModel.findMany({
            select: {
                id: true,
                name: true,
            }
        })
        console.log(models)

        return new Response(JSON.stringify(models))
    } catch (error) {
        return new Response(null, { status: 500 })
    }
}