import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import { haha } from "./controller/userController.js";

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

// Middleware
app.use("/server/user", userRouter);

app.get("/", haha);

app.listen(8080, () => {
  console.log("Server listening to Port 3000");
});
