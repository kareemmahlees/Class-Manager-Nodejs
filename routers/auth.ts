import session from "express-session"
import MongoStore from "connect-mongo"
import express from "express"
import { passport } from "./passport-config"

export const router = express.Router()
router.use(express.json())

const sessionStore = new MongoStore({
    mongoUrl: process.env.MONGODB_URL_CONNECTION as string
})

router.use(session({
    secret: "my secrete",
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
}))
router.use(passport.initialize())
router.use(passport.session())


router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "login"
}))