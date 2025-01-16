import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import env from "@/lib/env/server"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // !
        console.log("credentials", credentials)

        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const { email, password } = credentials

        const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/sign-in`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        })

        const data = await response.json()

        // !
        console.log("data", data)

        if (response.ok && data) {
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

      return token
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
