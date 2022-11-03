import z from "zod"

export const createTeacherSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8)
})

export const updateTeacherSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional()
})