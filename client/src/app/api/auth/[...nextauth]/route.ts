import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import env from "@/lib/env/server"
import { JWT } from "next-auth/jwt"

async function refreshToken(token: JWT): Promise<JWT> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token.refresh_token,
    }),
  })

  const data = await response.json()

  // !
  console.log("Refreshed Token")

  return {
    ...token,
    access_token: data?.access_token,
    refresh_token: data?.refresh_token,
    expiresAt: data?.expiresAt,
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const { email, password } = credentials

        const userAgent = req?.headers?.["user-agent"] || "Unknown"

        const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/sign-in`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": userAgent,
          },
          body: JSON.stringify({
            email,
            password,
          }),
        })

        const data = await response.json()

        // !
        // console.log("data", data)

        if (response.ok && data) {
          console.log("OKKKK")
          return data
        }

        if (data?.error) {
          throw new Error(data.message)
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user }
      }

      if (new Date() < new Date(token.expiresAt)) {
        return token
      }

      return await refreshToken(token)
    },

    async session({ token, session }) {
      session.user = token.user

      session.access_token = token.access_token
      session.refresh_token = token.refresh_token

      return session
    },
  },
  pages: {
    signIn: "/sign-in",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
