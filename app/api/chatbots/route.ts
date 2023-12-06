import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { db } from "@/lib/db"
import { chatbotSchema } from "@/lib/validations/chatbot";
import OpenAI from "openai";

export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session
    const chatbots = await db.chatbot.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      where: {
        userId: user?.id,
      },
    })

    return new Response(JSON.stringify(chatbots))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session

    const json = await req.json()
    const body = chatbotSchema.parse(json)
    console.log(body)

    const model = await db.chatbotModel.findUnique({
      where: {
        id: body.modelId
      }
    })

    if (!model) {
      console.log("model not found")
      return new Response(null, { status: 404 })
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

    const openai = new OpenAI({
      apiKey: openAIConfig?.globalAPIKey
    })

    const file = await db.file.findUnique({
      select: {
        id: true,
        openAIFileId: true,
      },
      where: {
        id: body.files,
      },
    })

    if (!file) {
      console.log("File not found")
      return new Response(null, { status: 404 })
    }

    const createdChatbot = await openai.beta.assistants.create({
      name: body.name,
      instructions: body.prompt,
      model: model.name,
      tools: [{ type: "retrieval" }],
      file_ids: [file?.openAIFileId!]
    })

    const chatbot = await db.chatbot.create({
      data: {
        name: body.name,
        prompt: body.prompt,
        openaiKey: body.openAIKey,
        openaiId: createdChatbot.id,
        modelId: model.id,
        userId: user?.id,
        welcomeMessage: body.welcomeMessage,
      },
      select: {
        id: true,
      },
    })

    await db.chatbotFiles.create({
      data: {
        chatbot: {
          connect: {
            id: chatbot.id,
          },
        },
        file: {
          connect: {
            id: file.id,
          },
        },
      }
    })

    return new Response(JSON.stringify({ chatbot }))
  } catch (error) {
    console.log(error)
    return new Response(null, { status: 500 })
  }
}
