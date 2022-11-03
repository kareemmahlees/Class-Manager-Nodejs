import express from "express";
import { Prisma } from "@prisma/client"
import { prisma } from "../database";
import { createStudentValidation, updateStudentValidation } from "../validators/student.validate"
import { StudentController } from "../controllers/student.controller"

const studentController = new StudentController(prisma.student)

export const router = express.Router()
router.use(express.json())

/**
 * return one user
 */
router.get("/:studentId", async (req, res) => {
    await studentController.getOneStudent(req.params.studentId)
        .then(returnedStudennt => res.json(returnedStudennt))
        .catch(e => {
            if (e instanceof Prisma.NotFoundError) {
                return res.status(404).json({ error: e.message })
            }
        })
})

router.get("/", async (req, res) => {
    await studentController.getAllStudents()
        .then(allStudents => res.json(allStudents))
})

router.post("/", async (req, res) => {
    let value
    try {
        value = await createStudentValidation.parseAsync(req.body)
    } catch (e) {
        return res.status(400).json(e)
    }

    await studentController.signUp(value)
        .then(createdStudent => res.status(201).json(createdStudent))
    // .catch(e => {
    //     if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //         if (e.code == "P2002") {
    //             return res.status(400).json({ error: e })
    //         }
    //     }
    // })
})

router.put("/:studentId", async (req, res) => {
    let value
    try {
        value = await updateStudentValidation.parseAsync(req.body)
    } catch (e) {
        return res.status(400).json(e)
    }
    await studentController.updateStudent(req.params.studentId, value)
        .then(updatedStudent => res.json(updatedStudent))
        .catch(e => {
            if (e instanceof Prisma.NotFoundError) {
                return res.status(404).json({ error: e.message })
            }
        })
})

router.delete("/:studentId", async (req, res) => {
    await studentController.deleteStudent(req.params.studentId)
        .then(deletedStudent => res.send())
        .catch(e => {
            if (e instanceof Prisma.NotFoundError) {
                return res.json({ error: e.message })
            }
        })
})