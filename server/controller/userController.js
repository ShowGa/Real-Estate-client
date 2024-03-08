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
    return res.status(200).json(rest);
  } catch (e) {
    next(e);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(
      errorHandler(
        (401, "Sneaky Peaky want to delete other person's account !")
      )
    );
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .clearCookie("access_token")
      .json("Your account had been deleted !");
  } catch (e) {
    next(e);
  }
};

export const getUser = async (req, res, next) => {
  try {
    // This id comes from client side listing userRef to get the landlord information in order to contact landlord .
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      next(errorHandler(404, "User not found"));
    }
    // destructure the information (exclude password)
    const { password: ps, ...rest } = user._doc;
    return res.status(200).json(rest);
  } catch (e) {
    next(e);
  }
};
