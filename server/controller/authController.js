import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    let saveResult = await newUser.save();
    return res.status(201).json({
      message: "Sign Up successfully !",
      saveResult,
    });
  } catch (e) {
    console.log("authCon signup catch error !");
    next(e);
  }
};
