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

import { JWT } from "next-auth/jwt"

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
