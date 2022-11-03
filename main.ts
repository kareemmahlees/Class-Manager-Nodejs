import express from "express";
import morgan from "morgan"
import dotenv from "dotenv"
import { router as teachersRouter } from "./routers/teacher"
import { router as studentsRouter } from "./routers/student"
dotenv.config()

const app = express()
app.use(morgan("dev"))
app.use("/teachers", teachersRouter)
app.use("/students", studentsRouter)
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ msg: "Hello world" });
});

app.listen(process.env.PORT || 8000);