"use client"

import config from "@/config/config"
import { GoogleLogin } from "@react-oauth/google"

export default function Home() {
  return (
    <main className="container flex flex-col items-center justify-center h-full gap-4">
      <h1 className="text-3xl font-semibold text-gray-900">Welcome to Auth App!</h1>
      <p className="text-center text-gray-600">
        This project is an authentication application that includes features such as login/signup, forgot password, email
        verification, session management, and Google OAuth authentication. It uses Nest.js as the backend framework and Next.js
        as the frontend framework.
      </p>

      <div>
        <GoogleLogin
          onSuccess={(response) =>
            fetch(`${config.apiUrl!}/api/auth/google-authentication`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token: response.credential }),
              credentials: "include",
            }).then((res) => console.log(res))
          }
        />
      </div>
    </main>
  )
}
