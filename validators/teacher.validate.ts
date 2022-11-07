import z from "zod"

export const createTeacherSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["student", "teacher"]).default("student")
})

export const updateTeacherSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    role: z.enum(["student", "teacher"]).optional()
})