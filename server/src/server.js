import express from "express";
// import cors from "cors";
import dotenv from "dotenv";
import connectdb from "./config/db.js";
import authRouter from "./routes/authRouter.js";
import formRoutes from "./routes/formRoutes.js";
dotenv.config()
const app = express();
// app.use(cors());
app.use(express.json());
const port = process.env.PORT || 4000;
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`)
    next()
})
app.get("/", (req, res)=>{
    res.send("server is running")
})
app.use("/api",authRouter)
app.use("/api/forms",formRoutes)
const startServer = async () => {
    await connectdb();
    app.listen(port, () => {
        console.log(`server is running on port ${port}`)
    })
}
startServer().catch((rror)=>{
    console.log("Server failed to start", error)
})