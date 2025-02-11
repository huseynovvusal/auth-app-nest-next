"use client"

import { Session } from "@/interfaces/session"
import { getUserSessions } from "@/services/auth"
import { useQuery } from "@tanstack/react-query"
import React from "react"

export default function Page() {
  const { data, isLoading, isError, error } = useQuery({
    queryFn: getUserSessions,
    queryKey: ["user_sessions"],
    refetchOnMount: "always",
    refetchInterval: false,
  })

  if (isLoading) {
    return <div>Loading data...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="flex flex-col space-y-4 justify-start pt-10">
      <h1 className="text-xl font-semibold text-primary">User Sessions</h1>

      <div className="flex flex-col space-y-4">
        {data?.sessions?.map(({ id, createdAt, ip, userAgent }: Session) => (
          <div className={"flex flex-col w-full text-gray-800 bg-gray-50 px-4 py-2 rounded-sm border border-gray-200"} key={id}>
            <span className="text-sm text-gray-500">
              {userAgent} ({ip})
            </span>
            <p>Session ID: {id}</p>
            <p>Created At: {new Date(createdAt).toString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
