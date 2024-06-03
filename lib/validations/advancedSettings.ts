import * as z from "zod"

export const advancedSettingsSchema = z.object({
    maxCompletionTokens: z.number().int().optional(),
    maxPromptTokens: z.number().int().optional(),
})