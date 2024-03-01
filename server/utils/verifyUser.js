import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  // check authorization
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  // verify the token
  // user comes from the verified token (comes from the sign token)
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden"));
    // set req.user to user
    req.user = user;
    next();
  });
};
