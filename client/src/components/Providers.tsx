"use client"

import { GoogleOAuthProvider } from "@react-oauth/google"
import { SessionProvider } from "next-auth/react"
import React, { useState } from "react"

import env from "@/lib/env/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <SessionProvider>
      <GoogleOAuthProvider clientId={env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </GoogleOAuthProvider>
    </SessionProvider>
  )
}
