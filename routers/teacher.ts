import express from "express";
import { Prisma } from "@prisma/client"
import { prisma } from "../database";
import { TeacherController } from "../controllers/teacher.controller"
import { createTeacherSchema, updateTeacherSchema } from "../validators/teacher.validate"

export const router = express.Router();
const teacherConroller = new TeacherController(prisma.teacher)

router.use(express.json())

/**
 * return all teachers
 */
router.get("/", async (req, res) => {
  return res.send(await teacherConroller.getTeachers())

})


/**
 * return one teacher
 */
router.get("/:teacherId", async (req, res) => {
  await teacherConroller.getTeacher(req.params.teacherId)
    .then(requiredTeacher => res.send(requiredTeacher))
    .catch(e => {
      if (e instanceof Prisma.NotFoundError) {
        return res.status(404).json({ error: e.message })
      }
    })
})

/**
 * create teacher
 */
router.post("/",
  async (req, res) => {
    try {
      const value = await createTeacherSchema.parseAsync(req.body)
    } catch (e) {
      return res.status(400).json(e)
    }
    await teacherConroller.signup(req.body)
      .then(createdTeacher => res.status(201).json(createdTeacher))
  })


/**
 * update teacher 
 */
router.put("/:teacherId", async (req, res) => {
  let value
  try {
    value = await updateTeacherSchema.parseAsync(req.body)
  } catch (e) {
    return res.status(400).json(e)
  }
  await teacherConroller.updateTeacher(req.params.teacherId, value)
    .then(updatedTeacher => res.json(updatedTeacher))
    .catch(e => res.status(500).json({ "error": "something went wrong" }))

})

/**
 * delete teacher
 */
router.delete('/:teacherId', async (req, res) => {
  await teacherConroller.deleteTeacher(req.params.teacherId)
  return res.status(200).send()
})