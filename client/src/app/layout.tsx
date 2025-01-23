import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"

import env from "@/lib/env/server"
import { GoogleOAuthProvider } from "@react-oauth/google"
import Navbar from "@/components/layout/Navbar"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react"
import Providers from "@/components/Providers"

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Auth App",
  description:
    "This project is an authentication application that includes features such as login/signup, forgot password, email verification, session management, and Google OAuth authentication. It uses Nest.js as the backend framework and Next.js as the frontend framework.",
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${poppins.variable} h-full antialiased`}>
        <Providers>
          <Navbar />

          <main className="container">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
