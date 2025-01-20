"use client"

import { getUserSessions } from "@/services/auth"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import React from "react"

export default function Page() {
  const { data: session } = useSession()

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => getUserSessions(session?.access_token),
    queryKey: ["user_sessions"],
  })

  if (isLoading) {
    return <div>Loading data...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <h1>User Sessions</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
