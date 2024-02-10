import { z } from "zod";

export const brandingSchema = z.object({
    displayBranding: z.boolean().default(false).optional(),
})