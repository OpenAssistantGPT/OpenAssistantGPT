import * as z from "zod"

export const advancedSettingsSchema = z.object({
    maxCompletionTokens: z.number().int().optional(),
    maxPromptTokens: z.number().int().optional(),
})

export const advancedSettingsSecurityFormSchema = z.object({
    allowEveryone: z.boolean().optional(),
})

export const advancedSettingsSecuritySchema = z.object({
    bannedIps: z.array(z.string()).optional(),
    allowEveryone: z.boolean().optional(),
    allowedIpRanges: z.array(z.string()).optional(),
})