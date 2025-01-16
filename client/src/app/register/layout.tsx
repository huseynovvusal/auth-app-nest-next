import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Auth App | Register",
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
