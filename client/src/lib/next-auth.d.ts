import { JWT } from "next-auth/jwt"
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: number
      firstName: string
      lastName: string
      email: string
      verified: boolean
      createdAt: Date
      updatedAt: Date
    }
    access_token: string
    refresh_token: string
    expiresAt: Date
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: number
      firstName: string
      lastName: string
      email: string
      verified: boolean
      createdAt: Date
      updatedAt: Date
    }
    access_token: string
    refresh_token: string
    expiresAt: Date
  }
}
