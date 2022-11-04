import { prisma } from "../database"
import { Passport } from "passport"
import passStrategy from "passport-local"
// import { validatePassword } from "../utils/password.utils"
import bcrypt from "bcrypt"

export const passport = new Passport()
// const returnSchema = {
//     id: true,
//     name: true,
//     email: true,
//     createdAt: true,
//     updatedAt: true
// }

const customFields = {
    username: "username",
    passwordField: "password",
    // passReqToCallback: true as false
}

const validateCallback = async function (username, password, done) {
    await prisma.student.findFirst({
        where: {
            name: username
        }
    }).then(async studentUser => {
        if (!studentUser) {
            await prisma.teacher.findFirst({
                where: {
                    name: username
                }
            }).catch(e => done(e)).then(async teacherUser => {
                if (!teacherUser) {
                    return done(null, false, { message: "Incorrect username" })
                }
                const isValid = await bcrypt.compare(password, teacherUser.password)
                if (!isValid) {
                    return done(null, false, { message: "Incorrect password" })
                }
                return done(null, teacherUser)
            })
        } else {

            const isValid = await bcrypt.compare(password, studentUser.password)
            if (!isValid) {
                return done(null, false, { message: "Incorrect Password" })
            }
            return done(null, studentUser)
        }
    }).catch(e => done(e))
}
// const startegy = new passStrategy.Strategy(customFields, validateCallback)
const startegy = new passStrategy.Strategy(customFields, validateCallback)

passport.use(startegy)
passport.serializeUser((user, done) => done(null, user["id"]))
passport.deserializeUser((id, done) => {
    return done(null, async function getUserById(id) {
        await prisma.student.findFirst({
            where: {
                id: id
            }
        }).then(async studentUser => {
            if (!studentUser) {
                await prisma.teacher.findFirst({
                    where: {
                        id: id
                    }
                }).then(teacherUser => teacherUser)
            } else {
                return studentUser
            }
        })
    })
})