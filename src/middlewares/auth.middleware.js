import jwt from "jsonwebtoken";
import { User } from "../models/auth.model.js";

export const authMiddleware = async (req, res, next) => {
  // get JWT token from either cookies or headers.
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  // if not - unauthorized.
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    // verify the token with JWT secret.
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Unauthorized - Invalid token." });

    // find user based on that token -
    // when token is verified we get the userId from payload which help find the user if exists
    // (basically we get all the details from payload which we provided during generating JWT).
    const findUser = await User.findById(user._id).select(
      "-password -verificationToken"
    );

    if (!findUser)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - User not found." });
    req.user = findUser; // contains user details (i.e, username, email, etc.)
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "something went wrong." });
  }
};
