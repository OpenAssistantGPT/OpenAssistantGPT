import * as z from "zod"

export const chatBrandingSettingsSchema = z.object({
    displayBranding: z.boolean().default(true),
})