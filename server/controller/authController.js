import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
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
    res.status(500).json(e.message);
    console.log(e);
  }
};
