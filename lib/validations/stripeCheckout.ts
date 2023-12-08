import * as z from "zod"

export const stripeCheckoutSchema = z.object({
    priceId: z.string(),
})