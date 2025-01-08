"use client"

import { useState } from "react"

import env from "@/lib/env/client"
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google"
import { FcGoogle } from "react-icons/fc"

export default function ContinueWithGoogleButton() {
  const [loading] = useState(false)

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        console.log("Google response:", response)

        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/google-authentication`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: response.access_token, isJwtToken: true }),
          credentials: "include",
        })

        if (!res.ok) {
          throw new Error("Failed to authenticate")
        }
        console.log("Authentication successful")
      } catch (error) {
        console.error("Error during authentication:", error)
      }
    },
    onError: (error) => console.log(error),
  })

  return (
    <button
      onClick={() => login()}
      disabled={loading}
      className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 focus:outline-none focus:ring focus:ring-gray-200"
    >
      <FcGoogle className="text-2xl" />
      <span className="text-sm">Continue with Google</span>
    </button>
  )
}
