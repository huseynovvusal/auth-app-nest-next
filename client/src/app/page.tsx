"use client"

import ContinueWithGoogleButton from "@/components/auth/ContinueWithGoogleButton"
import { useSession } from "next-auth/react"

export default function Page() {
  const { data: session } = useSession()

  return (
    <div className="container flex flex-col items-center justify-center h-full gap-4">
      <h1 className="text-3xl font-semibold text-primary">Welcome to Auth App!</h1>
      <p className="text-center text-gray-700 font-light">
        This project is an authentication application that includes features such as login/signup, forgot password, email
        verification, session management, and Google OAuth authentication. It uses Nest.js as the backend framework and Next.js
        as the frontend framework.
      </p>

      <span className="w-full">{JSON.stringify(session?.user, null, 2)}</span>

      <ContinueWithGoogleButton />
    </div>
  )
}
