import { apiClient } from "@/lib/axios"
import { RegisterInput } from "@/schemas/registerSchema"

export const register = async (body: RegisterInput) => {
  try {
    const response = await apiClient.post(`/auth/register`, JSON.stringify(body), {
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

export const getUserSessions = async () => {
  try {
    const response = await apiClient.get(`/auth/sessions`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    // !
    console.log("response", response.data)

    return response.data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error(String(error))
    }
  }
}

export const logOut = async (): Promise<void> => {
  try {
    await apiClient.get(`/auth/log-out`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error(String(error))
    }
  }
}
