import { z } from "zod";

export const customizationSchema = z.object({
    chatTitle: z.string().default("").optional(),
    chatMessagePlaceHolder: z.string().default("").optional(),
    bubbleColor: z.string().default("").optional(),
    bubbleTextColor: z.string().default("").optional(),
    chatHeaderBackgroundColor: z.string().default("").optional(),
    chatHeaderTextColor: z.string().default("").optional(),
    userReplyBackgroundColor: z.string().default(""),
    userReplyTextColor: z.string().default(""),
    chatbotLogoFilename: z.string().default("").optional(),
    chatbotLogo: z.any(),
    chatInputStyle: z.string().default("default"),
    chatHistoryEnabled: z.boolean().default(false),
})


export const customizationStringBackendSchema = z.object({
    chatbotLogoFilename: z.string().default("").optional(),
    chatTitle: z.string().default("").optional(),
    chatMessagePlaceHolder: z.string().default("").optional(),
    bubbleColor: z.string().default("").optional(),
    bubbleTextColor: z.string().default("").optional(),
    chatHeaderBackgroundColor: z.string().default("").optional(),
    chatHeaderTextColor: z.string().default("").optional(),
    userReplyBackgroundColor: z.string().default(""),
    userReplyTextColor: z.string().default(""),
    chatbotLogo: z.any(),
    chatInputStyle: z.string().default("default"),
    chatHistoryEnabled: z.string().default('false'),
})