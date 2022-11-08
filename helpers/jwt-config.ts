import jwt from "jsonwebtoken"
import { Request, Response } from "express"
import { prisma } from "../database"

export function generateToken(userId: string, role: "student" | "teacher") {
    return jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), id: userId, role: role }, process.env.TOKEN_SECRET as string)
}

export async function authMiddleware(req: Request, res: Response, next) {
    let token = req.headers["authorization"] as string
    if (!token) {
        return res.status(401).json({ error: "Unauthenticated" })
    }
    token = token.split(" ")[1]
    let tokenData
    try {
        tokenData = jwt.verify(token, process.env.TOKEN_SECRET as string)
    } catch (err) {
        return res.status(400).json({ error: "Invalid token" })
    }
    const checkExists = await prisma.user.findFirst({
        where: {
            id: tokenData.id,
            role: tokenData.role
        }
    })
    if (!checkExists) return res.status(400).json({ error: "User data extracted from the token doesn't exist" })
    req["userId"] = checkExists.id
    req["uesrRole"] = checkExists.role
    next()






}