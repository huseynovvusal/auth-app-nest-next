import * as z from "zod"

export const registerSchema = z.object({
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

export type RegisterInput = z.infer<typeof registerSchema>
