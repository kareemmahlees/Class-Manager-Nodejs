import { faker } from "@faker-js/faker"
import { PrismaClient, Role } from "@prisma/client"

const prisma = new PrismaClient()

async function seedUsers() {
    for (let i = 0; i < 10; i++) {
        await prisma.user.create({
            data: {
                name: faker.name.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: [Role.student, Role.teacher][Math.floor(Math.random() * 2)],
            }
        })
    }
}

seedUsers().then(() => console.log("seeding completed")

).catch(e => {
    console.error(e);
})