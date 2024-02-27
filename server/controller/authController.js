import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // authenticate the email
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found !"));
    // authenticate the password
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong Credential"));

    // Sign website token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    // I don't know what is this
    const { password: PS, ...rest } = validUser._doc;
    // Save in the cookie
    return res.cookie("access_token", token, { httpOnly: true }).json(rest);
  } catch (e) {
    console.log("authCon signup catch error !");
    next(e);
  }
};
