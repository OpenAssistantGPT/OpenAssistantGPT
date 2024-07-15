import * as z from "zod"

export const crawlerSchema = z.object({
    name: z.string().min(3).max(100),
    crawlUrl: z.string().url(),
    selector: z.string().min(1),
    urlMatch: z.string().min(1),
    maxPagesToCrawl: z.number().int().min(1).max(200),
})