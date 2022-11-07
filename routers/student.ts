import express from "express";
import { prisma } from "../database";
import { createStudentValidation, updateStudentValidation } from "../validators/student.validate"
import { StudentController } from "../controllers/student.controller"
import { authMiddleware } from "../helpers/jwt-config"

const studentController = new StudentController(prisma.user)

export const router = express.Router()
router.use(express.json())

/**
 * return one user
 */
router.get("/:studentId", async (req, res) => {
    const { statusCode, content } = await studentController.getOneStudent(req.params.studentId)
    return res.status(statusCode).send(content)

})

router.get("/", async (req, res) => {
    await studentController.getAllStudents()
        .then(allStudents => res.send(allStudents))
})

router.post("/", async (req, res) => {
    let value
    try {
        value = await createStudentValidation.parseAsync(req.body)
    } catch (e) {
        return res.status(400).json(e)
    }

    const { statusCode, content } = await studentController.createStudent(value)
    return res.status(statusCode).send(content)
})

router.put("/:studentId", authMiddleware, async (req, res) => {
    let value
    try {
        value = await updateStudentValidation.parseAsync(req.body)
    } catch (e) {
        return res.status(400).json(e)
    }
    const { statusCode, content } = await studentController.updateStudent(req.params.studentId, value, req["userId"])
    return res.status(statusCode).send(content)
})

router.delete("/:studentId", authMiddleware, async (req, res) => {
    const { statusCode, content } = await studentController.deleteStudent(req.params.studentId, req["userId"])
    return res.status(statusCode).send(content)
})