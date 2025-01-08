"use client"

import * as z from "zod"

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
})

export default envSchema.parse(process.env)
