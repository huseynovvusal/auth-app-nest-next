import * as z from "zod"

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string(),
  NEXT_PUBLIC_API_URL: z.string().nonempty(),
})

export default envSchema.parse({
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
})
