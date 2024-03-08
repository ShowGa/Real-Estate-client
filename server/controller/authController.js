import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
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
    // destructure the object ?
    const { password: PS, ...rest } = validUser._doc;
    // Save in the cookie
    const oneYearInSeconds = 365 * 24 * 60 * 60;
    return res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: oneYearInSeconds * 1000,
      })
      .status(200)
      .json(rest);
  } catch (e) {
    console.log("authCon signup catch error !");
    next(e);
  }
};

export const signinGoogle = async (req, res, next) => {
  try {
    const { username, email, photoURL } = req.body;
    const user = await User.findOne({ email });
    // Check if the User is exit
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: ps, ...rest } = user._doc;
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      // A - Z , 0 - 9 , last 8 digits
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        avatar: photoURL,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: ps, ...rest } = newUser._doc;
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (e) {
    next(e);
  }
};

export const signout = async (req, res, next) => {
  try {
    return res
      .clearCookie("access_token")
      .status(200)
      .json("You have signed out of your account!");
  } catch (e) {
    next(e);
  }
};
