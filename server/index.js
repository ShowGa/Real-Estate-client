import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("HelloW Bish !");
});

app.listen(3000, () => {
  console.log("Server listening to Port 3000");
});
