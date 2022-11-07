import express from "express"
import { loginSchema } from "../validators/auth.validate"
import { prisma } from "../database"
import { generateToken } from "../helpers/jwt-config"

export const router = express.Router()
router.use(express.json())

router.post("/login", async (req, res) => {
    let fields
    try {
        const fields = await loginSchema.parseAsync(req.body)
    } catch (err) {
        return res.status(400).send(err)
    }
    const getUser = await prisma.user.findFirst({
        where: {
            email: fields.email,
            password: fields.password
        }
    })
    if (!getUser) return res.status(400).json({ error: "Invalid email or password" })

    return { token: generateToken(getUser.id, getUser.role) }

})






