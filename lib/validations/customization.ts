import { z } from "zod";

export const customizationSchema = z.object({
    displayBranding: z.boolean().default(false).optional(),
    chatTitle: z.string().default("").optional(),
    chatMessagePlaceHolder: z.string().default("").optional(),
})