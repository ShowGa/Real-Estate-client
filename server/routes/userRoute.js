import express from "express";

const router = express.Router();

router.get("/haha", (req, res) => {
  res.json({ message: "fuck you !" });
});

export default router;
