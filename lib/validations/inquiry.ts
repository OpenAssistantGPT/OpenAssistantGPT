import * as z from "zod"

export const inquirySchema = z.object({
    chatbotId: z.string(),
    threadId: z.string(),
    email: z.string().email(),
    inquiry: z.string().min(1),
})