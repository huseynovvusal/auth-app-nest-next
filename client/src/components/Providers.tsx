"use client"

import { GoogleOAuthProvider } from "@react-oauth/google"
import { SessionProvider } from "next-auth/react"
import React from "react"

import env from "@/lib/env/client"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GoogleOAuthProvider clientId={env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>{children}</GoogleOAuthProvider>
    </SessionProvider>
  )
}
