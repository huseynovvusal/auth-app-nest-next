import { AxiosInstance } from "@/lib/axios"
import { RegisterInput } from "@/schemas/registerSchema"

export const register = async (body: RegisterInput) => {
  try {
    const response = await AxiosInstance.post(`/auth/register`, JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error(String(error))
    }
  }
}

export const getUserSessions = async (token: string) => {
  try {
    const response = await AxiosInstance.get(`/auth/sessions`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error(String(error))
    }
  }
}
