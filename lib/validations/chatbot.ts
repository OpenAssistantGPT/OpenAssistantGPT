import * as z from "zod"

export const chatbotSchema = z.object({
    name: z.string().min(3).max(50),
    openAIKey: z.string().min(1),
    prompt: z.string().min(1),
    welcomeMessage: z.string().min(1),
    modelId: z.string().min(1),
    files: z.string().optional(),
})
