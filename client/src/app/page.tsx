"use client"

import ContinueWithGoogleButton from "@/components/auth/ContinueWithGoogleButton"

export default function Page() {
  return (
    <main className="container flex flex-col items-center justify-center h-full gap-4">
      <h1 className="text-3xl font-semibold text-gray-900">Welcome to Auth App!</h1>
      <p className="text-center text-gray-600">
        This project is an authentication application that includes features such as login/signup, forgot password, email
        verification, session management, and Google OAuth authentication. It uses Nest.js as the backend framework and Next.js
        as the frontend framework.
      </p>

      <ContinueWithGoogleButton />
    </main>
  )
}
