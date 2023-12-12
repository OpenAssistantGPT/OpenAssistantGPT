import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatbotSchema } from "@/lib/validations/chatbot";
import { getServerSession } from "next-auth";
import OpenAI from "openai";
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
  const session = await getServerSession(authOptions)
  const { params } = routeContextSchema.parse(context)

  if (!(await verifyCurrentUserHasAccessToChatbot(params.chatbotId))) {
    return new Response(null, { status: 403 })
  }

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
        modelId: payload.modelId,
      },
      select: {
        id: true,
        name: true,
        openaiId: true,
        prompt: true,
        modelId: true,
      },
    })

    const currentFile = await db.chatbotFiles.findFirst({
      where: {
        chatbotId: chatbot.id,
      },
      select: {
        id: true,
        fileId: true,
      }
    })

    try {
      await db.chatbotFiles.delete({
        where: {
          id: currentFile?.id
        }
      })
    } catch (error) {
      console.log("No file to delete")
    }

    await db.chatbotFiles.create({
      data: {
        chatbotId: params.chatbotId,
        fileId: payload.files,
      },
    })

    const openai = new OpenAI({
      apiKey: openAIConfig?.globalAPIKey
    })

    const model = await db.chatbotModel.findFirst({
      where: {
        id: chatbot.modelId,
      },
      select: {
        id: true,
        name: true,
      }
    })

    const file = await db.file.findUnique({
      where: {
        id: payload.files,
      },
      select: {
        id: true,
        name: true,
        openAIFileId: true,
      }
    })

    await openai.beta.assistants.update(
      chatbot.openaiId,
      {
        name: chatbot.name,
        instructions: chatbot.prompt,
        model: model?.name,
        file_ids: [file?.openAIFileId || ''],
      }
    )

    return new Response(JSON.stringify(chatbot))
  } catch (error) {
    console.log(error)
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
    const session = await getServerSession(authOptions)

    const chatbot = await db.chatbot.findUnique({
      select: {
        id: true,
        name: true,
        openaiId: true,
      },
      where: {
        id: params.chatbotId
      }
    })

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

    await openai.beta.assistants.del(chatbot?.openaiId || '')

    await db.chatbot.delete({
      where: {
        id: params.chatbotId
      }
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    console.log(error)
    return new Response(null, { status: 500 })
  }
}