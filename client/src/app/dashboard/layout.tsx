import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Auth App | Dashboard",
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
