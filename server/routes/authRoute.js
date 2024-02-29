import express from "express";
import { signin, signup } from "../controller/authController.js";
import { signinGoogle } from "../controller/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/google", signinGoogle);

export default router;
