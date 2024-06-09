import * as z from "zod"

export const exportMessagesSchema = z.object({
    chatbotId: z.string(),
    lastXDays: z.number().int().positive(),
})