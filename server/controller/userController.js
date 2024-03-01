import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

export const updateUser = async (req, res, next) => {
  // check if the req.user(set from token) is match to req.params
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "Got you ! Sneaky peaky !"));
  }
  // Pass the check, then start update the user
  try {
    const { username, email, password, avatar } = req.body;
    // hash the password with bcrypt
    if (password) {
      password = bcrypt.hashSync(password, 10);
    }
    // update the User
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username,
          email,
          password,
          avatar,
        },
      },
      // return new info result
      { new: true }
    );
    // To not send the password
    const { password: ps, ...rest } = updatedUser._doc;
    // res
    res.status(200).json(rest);
  } catch (e) {
    next(e);
  }
};
