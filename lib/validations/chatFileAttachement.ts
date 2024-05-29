import * as z from "zod"

export const chatFileAttachementSettingsSchema = z.object({
    chatFileAttachementEnabled: z.boolean().default(false),
})