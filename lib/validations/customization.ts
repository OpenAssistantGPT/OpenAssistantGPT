import { z } from "zod";

export const customizationSchema = z.object({
    displayBranding: z.boolean().default(false).optional(),
    chatTitle: z.string().default("").optional(),
    chatMessagePlaceHolder: z.string().default("").optional(),
    bubbleColor: z.string().default("").optional(),
    bubbleTextColor: z.string().default("").optional(),
    chatHeaderBackgroundColor: z.string().default("").optional(),
    chatHeaderTextColor: z.string().default("").optional(),
})