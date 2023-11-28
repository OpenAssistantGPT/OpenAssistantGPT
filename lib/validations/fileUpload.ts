import * as z from "zod"

export const fileUploadSchema = z.object({
    file: z.string().min(1),
})