import express from "express";
import { deleteUser, updateUser } from "../controller/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.patch("/update/:id", verifyToken, updateUser);

router.delete("/delete/:id", verifyToken, deleteUser);

export default router;
