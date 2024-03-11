import * as z from "zod"

export const crawlerSchema = z.object({
    name: z.string().min(3).max(32),
    crawlUrl: z.string().url(),
    selector: z.string().min(1),
    urlMatch: z.string().min(1)
})