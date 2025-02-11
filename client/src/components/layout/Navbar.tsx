"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { logOut } from "@/services/auth"

export default function Navbar() {
  const { data: session } = useSession()

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogOut = async () => {
    setIsLoggingOut(true)

    try {
      await logOut()
      await signOut({ redirect: true })
    } catch (error) {
      toast({
        title: "Log out failed",
        description: error instanceof Error ? error.message : "An error occurred while logging out",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className="navbar bg-base-100 fixed top-0 left-0 w-full z-50 shadow-sm shadow-gray-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link href="/" className="text-xl text-primary">
          Auth App
        </Link>
      </div>
      <div className="navbar-end gap-2">
        {session?.user ? (
          <button
            onClick={handleLogOut}
            className={`btn btn-sm ${isLoggingOut ? "btn-disabled pointer-events-none" : "btn-accent"}`}
          >
            Log out
          </button>
        ) : (
          <>
            <Link className="btn btn-sm btn-ghost" href="/register">
              Register
            </Link>
            <Link className="btn btn-sm btn-primary" href="/sign-in">
              Sign in
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
