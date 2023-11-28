
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { db } from "@/lib/db"
import { chatbotSchema } from "@/lib/validations/chatbot";

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
    // If user is on a free plan.
    // Check if user has reached limit of 3 posts.
    //if (!subscriptionPlan?.isPro) {
    //    const count = await db.post.count({
    //        where: {
    //            authorId: user.id,
    //        },
    //    })

    //    if (count >= 3) {
    //        throw new RequiresProPlanError()
    //    }
    //}

    // Validate the request body.
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

    const chatbot = await db.chatbot.create({
      data: {
        name: body.name,
        prompt: body.prompt,
        openaiKey: body.openAIKey,
        modelId: model.id,
        userId: user?.id,
        welcomeMessage: body.welcomeMessage,
      },
      select: {
        id: true,
      },
    })

    let file = null

    if (body.files) {
      file = await db.crawlerFile.findUnique({
        select: {
          id: true,
          name: true,
        },
        where: {
          id: body.files
        }
      })

      console.log(`crawlerFile: ${file}`)
      if (file == null) {
        file = await db.uploadFile.findUnique({
          select: {
            id: true,
            name: true,
          },
          where: {
            id: body.files
          }
        })
        await db.chatbotUploadFiles.create({
          data: {
            chatbotId: chatbot.id,
            uploadFileId: file?.id || "",
          }
        })
      } else {
        await db.chatbotFiles.create({
          data: {
            chatbotId: chatbot.id,
            crawlerFileId: file?.id || "",
          }
        })
      }


    }

    return new Response(JSON.stringify({ chatbot }))
  } catch (error) {
    console.log(error)
    return new Response(null, { status: 500 })
  }
}