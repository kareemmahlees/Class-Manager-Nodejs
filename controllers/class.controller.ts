import { PrismaClient } from "@prisma/client"

type createClass = {
    name: string,
    teacherId: string
}

interface callbackResult {
    statusCode: number
    // eslint-disable-next-line
    content: object | any
}
export class ClassController {

    constructor(private readonly prismaClass: PrismaClient['class']) { }

    async createClass(name: string, teacherId: string): Promise<callbackResult> {
        const classNameExists = await this.prismaClass.findFirst({
            where: {
                name: name
            }
        })
        if (classNameExists) return { statusCode: 400, content: { error: `Class with name ${name} already exists` } }
        const createdClass = await this.prismaClass.create({
            data: {
                name: name,
                teacherId: teacherId
            }
        })
        return { statusCode: 201, content: createdClass }
    }

    async listTeacherClassess(teacherId: string): Promise<callbackResult> {
        const allClassess = await this.prismaClass.findMany({
            where: {
                teacherId: teacherId
            },
            select: {
                id: true,
                name: true,
                students: true
            },
        })
        return { statusCode: 200, content: allClassess }
    }

    async enrollStudent(studentId: string, className: string): Promise<callbackResult> {
        const enrollment = await this.prismaClass.update({
            where: {
                name: className
            },
            data: {
                students: {
                    connect: {
                        id: studentId
                    }
                }
            },
            select: {
                id: true,
                name: true,
                students: true
            }
        })
        return { statusCode: 200, content: enrollment }
    }

}