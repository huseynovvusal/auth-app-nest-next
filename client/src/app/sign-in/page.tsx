"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { signIn } from "next-auth/react"
import ContinueWithGoogleButton from "@/components/auth/ContinueWithGoogleButton"
import Link from "next/link"
import { SigninInput, signinSchema } from "../../schemas/signinSchema"
import { FaEnvelope, FaLock } from "react-icons/fa"

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninInput>({
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
          <FaEnvelope className="text-gray-500" />
          <input id="email" type="text" className="grow" placeholder="Email" {...register("email")} />
        </label>
        {errors.email && <p className="text-destructive text-xs">{errors.email.message?.toString()}</p>}

        <label className="input input-bordered flex items-center gap-2">
          <FaLock className="text-gray-500" />
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
