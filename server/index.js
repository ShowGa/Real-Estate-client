import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userRoute.js";
import { haha } from "./controller/userController.js";
import authRouter from "./routes/authRoute.js";

dotenv.config();

const app = express();

mongoose
  .connect("mongodb://127.0.0.1/EstateDB")
  .then(() => {
    console.log("Successfully connect to MongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

/*-------------Middleware------------*/
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Router middleware
app.use("/server/user", userRouter);
app.use("/server/auth", authRouter);
// error dealer middleware
app.use((err, req, res, next) => {
  console.log("Inside error dealing middleware !");
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(8080, () => {
  console.log("Server listening to Port 8080");
});
