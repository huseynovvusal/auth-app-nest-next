import axios from "axios"

export const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    //? Log API error if available
    if (error.response) {
      return Promise.reject(new Error(error.response.data.message))
    }

    return Promise.reject(error)
  }
)
