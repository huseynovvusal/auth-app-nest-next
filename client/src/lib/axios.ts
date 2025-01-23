import axios from "axios"
import { getSession } from "next-auth/react"

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession()

    if (session) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    //? Log API error if available
    if (error.response) {
      return Promise.reject(new Error(error.response.data.message))
    }

    return Promise.reject(error)
  }
)
