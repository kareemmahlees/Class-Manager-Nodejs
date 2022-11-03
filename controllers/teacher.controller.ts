import { PrismaClient, Teacher, Prisma } from "@prisma/client";
import bcrypt from "bcrypt"


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

export class TeacherController {
    private readonly returnSchema = {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
    }

    constructor(private readonly prismaTeacher: PrismaClient["teacher"]) { }


    async signup(data: Signup) {
        data.password = await bcrypt.hash(data.password, 10)

        return await this.prismaTeacher.create({
            data: data, select: this.returnSchema
        })
    }


    async getTeachers() {
        return await this.prismaTeacher.findMany({
            select: this.returnSchema
        })
    }

    async getTeacher(teacherId: string) {
        return await this.prismaTeacher.findFirstOrThrow({
            where: {
                id: teacherId
            },
            select: this.returnSchema
        })

    }

    async updateTeacher(teacherId: string, updateData: UpdateTeacher) {
        return await this.prismaTeacher.update({
            where: {
                id: teacherId
            },
            data: updateData,
            select: this.returnSchema,
        })
    }

    async deleteTeacher(teacherId: string) {
        return await this.prismaTeacher.delete({
            where: {
                id: teacherId
            }
        }).catch(e => e.meta.cause)
    }

}
