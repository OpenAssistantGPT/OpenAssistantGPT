import * as z from "zod"

export const notificationSchema = z.object({
    inquiryNotificationEnabled: z.boolean(),
    marketingEmailEnabled: z.boolean(),
})