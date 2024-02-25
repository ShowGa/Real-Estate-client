import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

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

app.get("/", (req, res) => {
  res.send("HelloW Bish !");
});

app.listen(8080, () => {
  console.log("Server listening to Port 3000");
});
