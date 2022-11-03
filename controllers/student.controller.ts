import { PrismaClient, Student, Prisma } from "@prisma/client";
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

export class StudentController {

    private readonly returnSchema = {
        id: true,
        name: true,
        email: true,
        class: true,
        createdAt: true,
        updatedAt: true,
    }

    constructor(private readonly prismaStudent: PrismaClient["student"]) { }

    async getOneStudent(studentId: string) {
        return await this.prismaStudent.findFirstOrThrow({
            where: {
                id: studentId
            },
            select: this.returnSchema,

        })
    }
    async getAllStudents() {
        return await this.prismaStudent.findMany({
            select: this.returnSchema
        })
    }
    async signUp(data: Signup) {
        return await this.prismaStudent.create({
            data: data,
            select: this.returnSchema
        })
    }
    async updateStudent(studentId: string, updateData: UpdateTeacher) {
        return await this.prismaStudent.update({
            where: {
                id: studentId
            },
            data: updateData,
            select: this.returnSchema
        })
    }
    async deleteStudent(studentId: string) {
        return await this.prismaStudent.delete({
            where: {
                id: studentId
            }
        })
    }
}