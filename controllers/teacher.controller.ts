import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt"
import { generateToken } from "../helpers/jwt-config"


type Signup = {
    name: string
    email: string
    password: string
    role: Role
}

type UpdateTeacher = {
    name?: string
    email?: string
    password?: string
}

interface callbackResult {
    statusCode: number
    // eslint-disable-next-line
    content: object | any
}
export class TeacherController {
    private readonly returnSchema = {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
    }

    constructor(private readonly prismaUser: PrismaClient["user"]) { }

    async createTeacher(data: Signup): Promise<callbackResult | (callbackResult & { token: string; })> {
        const checkExists = await this.prismaUser.findFirst({
            where: {
                OR: [{ name: data.name, role: Role.teacher }, { email: data.email, role: Role.teacher }]
            }
        })
        if (checkExists) return { statusCode: 400, content: { error: "User with name or email already exists" } }
        data.password = await bcrypt.hashSync(data.password, 10)

        const createdTeacher = await this.prismaUser.create({
            data: data, select: this.returnSchema
        })
        return { statusCode: 201, content: { teacher: createdTeacher, token: generateToken(createdTeacher.id, createdTeacher.role) } }
    }


    async getAllTeachers() {
        return await this.prismaUser.findMany({
            where: {
                role: Role.teacher
            },
            select: this.returnSchema,
        })
    }

    async getOneTeacher(teacherId: string): Promise<callbackResult> {
        const teacher = await this.prismaUser.findFirst({
            where: {
                id: teacherId,
                role: Role.teacher
            },
            select: this.returnSchema
        })
        if (!teacher) {
            return { statusCode: 404, content: { error: `Teacher with id ${teacherId} was not found` } }
        }
        return { statusCode: 200, content: teacher }

    }

    async updateTeacher(teacherParamId: string, updateData: UpdateTeacher, reqUserId: string): Promise<callbackResult> {
        const teacher = await this.prismaUser.findFirst({
            where: {
                id: teacherParamId,
                role: Role.teacher
            }
        })
        if (!teacher) {
            return { statusCode: 404, content: { error: `Teacher with id ${teacherParamId} was not found` } }
        }
        if (reqUserId !== teacher.id) {
            return { statusCode: 401, content: { error: "Unauthorized action" } }
        }
        const updatedTeacher = await this.prismaUser.update({
            where: {
                id: teacher.id
            },
            data: updateData
        })
        return { statusCode: 200, content: updatedTeacher }
    }

    async deleteTeacher(teacherParamId: string, reqUserId: string): Promise<callbackResult> {
        const teacher = await this.prismaUser.findFirst({
            where: {
                id: teacherParamId,
                role: Role.teacher
            }
        })
        if (!teacher) {
            return { statusCode: 404, content: { error: `Teacher with id ${teacherParamId} was not found` } }
        }
        if (teacherParamId !== reqUserId) return { statusCode: 401, content: { error: "Unauthorized action" } }
        await this.prismaUser.delete({
            where: {
                id: teacherParamId
            }
        })
        return { statusCode: 200, content: "" }

    }

}
