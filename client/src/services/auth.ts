import { ERROR_CREATING_USER } from "@/constants/errors"
import env from "@/lib/env/client"
import { RegisterInput } from "@/schemas/registerSchema"

export const register = async (body: RegisterInput) => {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.message ?? ERROR_CREATING_USER)
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error(String(error))
    }
  }
}
