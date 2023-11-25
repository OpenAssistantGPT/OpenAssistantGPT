import * as z from "zod"

export const openAIConfigSchema = z.object({
    globalAPIKey: z.string().min(1),
})