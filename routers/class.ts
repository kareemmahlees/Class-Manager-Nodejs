import express from "express"
import { createClassSchema } from "../validators/class.validate"
import { prisma } from "../database"
import { ClassController } from "../controllers/class.controller"
import { authMiddleware } from "../helpers/jwt-config"
export const router = express.Router()

router.use(express.json())
const classController = new ClassController(prisma.class)


router.post("/create-class/:className", authMiddleware, async (req, res) => {
    // let fields
    // try {
    //     fields = await createClassSchema.parseAsync(req.body)
    // } catch (err) {
    //     return res.status(400).send(err)
    // }
    const { statusCode, content } = await classController.createClass(req.params.className, req['userId'])
    return res.status(statusCode).send(content)

})

router.get("/list-classes", authMiddleware, async (req, res) => {
    const { statusCode, content } = await classController.listTeacherClassess(req["userId"])
    return res.status(statusCode).send(content)
})

router.post("/enroll-student/:className", authMiddleware, async (req, res) => {
    const { statusCode, content } = await classController.enrollStudent(req["userId"], req.params.className)
    return res.status(statusCode).send(content)
})