import * as z from "zod"

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string(),
})

export default envSchema.parse({
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
})
