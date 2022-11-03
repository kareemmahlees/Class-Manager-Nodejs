import z from "zod"

export const createStudentValidation = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8)
})

export const updateStudentValidation = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional()
})