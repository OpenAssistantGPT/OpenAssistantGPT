import * as z from "zod"

export const inquiryCustomizationSchema = z.object({
    inquiryEnabled: z.boolean().default(false).optional(),
    inquiryLinkText: z.string(),
    inquiryTitle: z.string(),
    inquirySubtitle: z.string(),
    inquiryEmailLabel: z.string(),
    inquiryMessageLabel: z.string(),
    inquirySendButtonText: z.string(),
    inquiryAutomaticReplyText: z.string(),
    inquiryDisplayLinkAfterXMessage: z.coerce.number().min(1).max(5),
})