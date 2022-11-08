import z from "zod"

export const createClassSchema = z.object({
    name: z.string(),
    teacherId: z.string().uuid()
})