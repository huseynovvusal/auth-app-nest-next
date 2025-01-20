"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import ContinueWithGoogleButton from "@/components/auth/ContinueWithGoogleButton"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RegisterInput, registerSchema } from "../../schemas/registerSchema"
import { useMutation } from "@tanstack/react-query"
import { register } from "@/services/auth"
import { ERROR_CREATING_USER } from "@/constants/errors"
import { useEffect } from "react"
import { FaEnvelope, FaLock } from "react-icons/fa"

export default function Page() {
  const {
    register: r,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })
  const router = useRouter()
  const { toast } = useToast()

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "You have successfully registered, now sign in.",
      })
      router.push("/sign-in")
    },
  })

  useEffect(() => {
    if (registerMutation.error) {
      toast({
        title: "Registration failed",
        description: registerMutation.error.message ?? ERROR_CREATING_USER,
        variant: "destructive",
      })
    }
  }, [registerMutation.error])

  return (
    <div
      className={`container ${
        registerMutation.isPending && "pointer-events-none opacity-75"
      } flex flex-col items-center  justify-center h-full gap-4`}
    >
      <form
        className="flex flex-col gap-2 w-full max-w-[500px]"
        onSubmit={handleSubmit((data) => registerMutation.mutate(data))}
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl text-primary">Register</h1>
          <p className="text-gray-500 font-thin text-sm">Fill in the form below to register.</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="input input-bordered flex items-center gap-2">
            <input id="firstName" type="text" className="grow" placeholder="First name" {...r("firstName")} />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <input id="lastName" type="text" className="grow" placeholder="Last name" {...r("lastName")} />
          </label>
        </div>
        {(errors.firstName || errors.lastName) && (
          <div className="grid grid-cols-2 gap-2">
            {errors.firstName && <p className="text-destructive text-xs">{errors.firstName.message?.toString()}</p>}
            {errors.lastName && <p className="text-destructive text-xs">{errors.lastName.message?.toString()}</p>}
          </div>
        )}

        <label className="input input-bordered flex items-center gap-2">
          <FaEnvelope className="text-gray-500" />
          <input id="email" type="text" className="grow" placeholder="Email" {...r("email")} />
        </label>
        {errors.email && <p className="text-destructive text-xs">{errors.email.message?.toString()}</p>}

        <label className="input input-bordered flex items-center gap-2">
          <FaLock className="text-gray-500" />
          <input id="password" type="password" className="grow" placeholder="Password" {...r("password")} />
        </label>
        {errors.password && <p className="text-destructive text-xs">{String(errors.password.message)}</p>}

        <button type="submit" className={`btn ${registerMutation.isPending ? "btn-disabled" : "btn-primary"} text-white`}>
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
