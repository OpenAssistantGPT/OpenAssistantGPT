import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatbotSchema } from "@/lib/validations/chatbot";
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

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {

  const { params } = routeContextSchema.parse(context)

  if (!(await verifyCurrentUserHasAccessToChatbot(params.chatbotId))) {
    return new Response(null, { status: 403 })
  }

  try {
    const chatbot = await db.chatbot.findUnique({
      select: {
        id: true,
        name: true,
        createdAt: true,
        crawlerFile: {
          select: {
            id: true,
            name: true,
            blobUrl: true,
            createdAt: true,
          }
        },
      },
      where: {
        id: params.chatbotId,
      },
    })

    return new Response(JSON.stringify(chatbot))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}


export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const { params } = routeContextSchema.parse(context)

  console.log(params)

  if (!(await verifyCurrentUserHasAccessToChatbot(params.chatbotId))) {
    return new Response(null, { status: 403 })
  }
  const body = await req.json()
  const payload = chatbotSchema.parse(body)

  try {
    const chatbot = await db.chatbot.update({
      where: {
        id: params.chatbotId
      },
      data: {
        name: payload.name,
        welcomeMessage: payload.welcomeMessage,
        prompt: payload.prompt,
        openaiKey: payload.openAIKey,
        modelId: payload.model,
      },
      select: {
        id: true,
        name: true,
      },
    })

    return new Response(JSON.stringify(chatbot))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {

  const { params } = routeContextSchema.parse(context)

  if (!(await verifyCurrentUserHasAccessToChatbot(params.chatbotId))) {
    return new Response(null, { status: 403 })
  }

  try {
    // TODO Add delete in openAI platform 
    await db.chatbot.delete({
      where: {
        id: params.chatbotId
      }
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}