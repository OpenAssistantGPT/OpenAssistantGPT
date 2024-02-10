import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as z from "zod"

import { db } from "@/lib/db"
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { RequiresHigherPlanError } from "@/lib/exceptions";

const crawlerCreateSchema = z.object({
    name: z.string(),
    crawlUrl: z.string(),
    urlMatch: z.string(),
    selector: z.string()
})

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response("Unauthorized", { status: 403 })
        }

        const { user } = session
        const crawlers = await db.crawler.findMany({
            select: {
                id: true,
                name: true,
                createdAt: true,
            },
            where: {
                userId: user?.id,
            },
        })

        return new Response(JSON.stringify(crawlers))
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

        // Validate user subscription plan
        const { user } = session
        const subscriptionPlan = await getUserSubscriptionPlan(user.id)

        const count = await db.crawler.count({
            where: {
                userId: user.id,
            },
        })

        if (count >= subscriptionPlan.maxCrawlers) {
            throw new RequiresHigherPlanError()
        }

        const json = await req.json()
        const body = crawlerCreateSchema.parse(json)

        const crawler = await db.crawler.create({
            data: {
                name: body.name,
                crawlUrl: body.crawlUrl,
                urlMatch: body.urlMatch,
                selector: body.selector,
                maxPagesToCrawl: 25,
                userId: session?.user?.id,
            },
            select: {
                id: true,
            },
        })

        return new Response(JSON.stringify(crawler))
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