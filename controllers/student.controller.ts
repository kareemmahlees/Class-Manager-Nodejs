import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt"
import { resolve } from "path";
import { generateToken } from "../helpers/jwt-config"


type Signup = {
    name: string
    email: string
    password: string
}

type UpdateTeacher = {
    name?: string
    email?: string
    password?: string
}

interface callbackResult {
    statusCode: number
    // eslint-disable-next-line
    content: string | any
}
export class StudentController {

    private readonly returnSchema = {
        id: true,
        name: true,
        email: true,
        class: true,
        createdAt: true,
        updatedAt: true,
    }

    constructor(private readonly prismaStudent: PrismaClient["user"]) { }

    async getOneStudent(studentId: string): Promise<callbackResult> {
        const student = await this.prismaStudent.findFirst({
            where: {
                id: studentId,
                role: Role.student
            },
            select: this.returnSchema,
        })
        if (!student) return { statusCode: 404, content: `Student with id ${studentId} was not found` }
        return { statusCode: 200, content: student }
    }
    async getAllStudents() {
        return await this.prismaStudent.findMany({
            where: {
                role: Role.student
            },
            select: this.returnSchema,
        })
    }
    async createStudent(data: Signup): Promise<callbackResult | (callbackResult & { token: string; })> {
        const checkExists = await this.prismaStudent.findFirst({
            where: {
                OR: [{ name: data.name }, { email: data.email }]
            }
        })
        if (checkExists) return { statusCode: 400, content: "User with name or email already exists" }
        data.password = await bcrypt.hashSync(data.password, 10)
        const createdTeacher = await this.prismaStudent.create({
            data: data
        })
        return { statusCode: 201, content: createdTeacher, token: generateToken(createdTeacher.id, createdTeacher.role) }

    }
    async updateStudent(studentParamId: string, updateData: UpdateTeacher, reqUserId: string): Promise<callbackResult> {
        const checkExists = await this.prismaStudent.findFirst({
            where: {
                id: studentParamId,
                role: Role.student
            }
        })
        if (!checkExists) return { statusCode: 400, content: `Student with id ${studentParamId} doesn't exist` }
        if (studentParamId !== reqUserId) return { statusCode: 401, content: { error: "Unauthorized action" } }
        const updatedStudent = await this.prismaStudent.update({
            where: {
                id: studentParamId
            },
            data: updateData,
            select: this.returnSchema
        })
        return { statusCode: 200, content: updatedStudent }
    }
    async deleteStudent(studentParamId: string, reqUserId: string): Promise<callbackResult> {
        const checkExists = await this.prismaStudent.findFirst({
            where: {
                id: studentParamId, role: Role.student
            }
        })
        if (!checkExists) return { statusCode: 404, content: { error: `Student with id ${studentParamId} doesn't exist` } }
        if (studentParamId !== reqUserId) return { statusCode: 401, content: { error: "Unauthorized action" } }
        await this.prismaStudent.delete({
            where: {
                id: studentParamId
            }
        })
        return { statusCode: 200, content: "" }
    }
}