"use client"

import { useState } from "react"

import env from "@/lib/env/client"
import { CredentialResponse, GoogleLogin } from "@react-oauth/google"

export default function ContinueWithGoogleButton() {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async (response: CredentialResponse) => {
    try {
      setLoading(true)

      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/google-authentication`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: response.credential }),
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error("Failed to authenticate")
      }
      console.log("Authentication successful")
    } catch (error) {
      console.error("Error during authentication:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GoogleLogin
      logo_alignment="left"
      useOneTap={false}
      text="continue_with"
      theme="filled_black"
      shape="circle"
      onSuccess={handleGoogleLogin}
    />
  )
}
