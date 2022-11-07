import express from "express";
import { prisma } from "../database";
import { TeacherController } from "../controllers/teacher.controller"
import { createTeacherSchema, updateTeacherSchema } from "../validators/teacher.validate"
import { authMiddleware } from "../helpers/jwt-config"

export const router = express.Router();
const teacherConroller = new TeacherController(prisma.user)

router.use(express.json())

/**
 * return all teachers
 */
router.get("/", async (req, res) => {
  return res.send(await teacherConroller.getAllTeachers())

})


/**
 * return one teacher
 */
router.get("/:teacherId", async (req, res) => {
  const { statusCode, content } = await teacherConroller.getOneTeacher(req.params.teacherId)
  return res.status(statusCode).send(content)
})

/**
 * create teacher
 */
router.post("/",
  async (req, res) => {
    let fields
    try {
      fields = await createTeacherSchema.parseAsync(req.body)
    } catch (e) {
      return res.status(400).json(e)
    }
    const { statusCode, content } = await teacherConroller.createTeacher(fields)
    return res.status(statusCode).send(content)
  })


/**
 * update teacher 
 */
router.put("/:teacherId", authMiddleware, async (req, res) => {
  let fields
  try {
    fields = await updateTeacherSchema.parseAsync(req.body)
  } catch (e) {
    return res.status(400).json(e)
  }
  const { statusCode, content } = await teacherConroller.updateTeacher(req.params.teacherId, fields, req["userId"])
  return res.status(statusCode).send(content)
})

/**
 * delete teacher
 */
router.delete('/:teacherId', authMiddleware, async (req, res) => {
  const { statusCode, content } = await teacherConroller.deleteTeacher(req.params.teacherId, req['userId'])
  return res.status(statusCode).send(content)
})