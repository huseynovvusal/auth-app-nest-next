"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { signIn } from "next-auth/react"
import ContinueWithGoogleButton from "@/components/auth/ContinueWithGoogleButton"
import Link from "next/link"

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
  })

  const [loading, setLoading] = useState(false)

  const { toast } = useToast()
  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: "http://localhost:3000",
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Sign in successful",
        description: "You have successfully signed in.",
      })
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "An error occurred while signing in.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`container ${
        loading && "pointer-events-none opacity-75"
      } flex flex-col items-center  justify-center h-full gap-4`}
    >
      <form className="flex flex-col gap-2 w-full max-w-[500px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl text-primary">Sign In</h1>
          <p className="text-gray-500 font-thin text-sm">Fill in the form below to sign in.</p>
        </div>

        <label className="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input id="email" type="text" className="grow" placeholder="Email" {...register("email")} />
        </label>
        {errors.email && <p className="text-destructive text-xs">{errors.email.message?.toString()}</p>}

        <label className="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input id="password" type="password" className="grow" placeholder="Password" {...register("password")} />
        </label>
        {errors.password && <p className="text-destructive text-xs">{String(errors.password.message)}</p>}

        <button type="submit" className={`btn ${loading ? "btn-disabled" : "btn-primary"} text-white`}>
          Sign In
        </button>

        <ContinueWithGoogleButton />

        <span className="text-sm text-gray-500">
          Don't you have an account?{" "}
          <Link href="/register" className="underline text-blue-700">
            Register
          </Link>
        </span>
      </form>
    </div>
  )
}
