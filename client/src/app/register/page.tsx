"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import env from "@/lib/env/client"
import { useToast } from "@/hooks/use-toast"
import ContinueWithGoogleButton from "@/components/auth/ContinueWithGoogleButton"
import Link from "next/link"

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name is required").max(96, "First name must be less than 96 characters"),
  lastName: z.string().min(2, "Last name is required").max(96, "Last name must be less than 96 characters"),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Minimum eight characters, at least one letter, one number and one special character"
    ),
})

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  })

  const [loading, setLoading] = useState(false)

  const { toast } = useToast()

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setLoading(true)

    try {
      const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Sign in successful",
          description: "You have successfully registered.",
        })
      } else {
        const data = await response.json()

        toast({
          title: data?.error || "Sign in failed",
          description: data?.message || "An error occurred while creating new user.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "An error occurred while signing in.",
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
          <h1 className="text-4xl text-primary">Register</h1>
          <p className="text-gray-500 font-thin text-sm">Fill in the form below to register.</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="input input-bordered flex items-center gap-2">
            <input id="firstName" type="text" className="grow" placeholder="First name" {...register("firstName")} />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <input id="lastName" type="text" className="grow" placeholder="Last name" {...register("lastName")} />
          </label>
        </div>
        {(errors.firstName || errors.lastName) && (
          <div className="grid grid-cols-2 gap-2">
            {errors.firstName && <p className="text-destructive text-xs">{errors.firstName.message?.toString()}</p>}
            {errors.lastName && <p className="text-destructive text-xs">{errors.lastName.message?.toString()}</p>}
          </div>
        )}

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
          Register
        </button>

        <ContinueWithGoogleButton />

        <span className="text-sm text-gray-500">
          Do you have an account?{" "}
          <Link href="/sign-in" className="underline text-blue-700">
            Sign in
          </Link>
        </span>
      </form>
    </div>
  )
}
