import { User } from "../models/auth.model.js";
import mongoose from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../config/stream.config.js";
import {
  ForgerPasswordLinkMail,
  PasswordResetSuccessMail,
  VerifyEmailMail,
  VerifyEmailSuccessMail,
} from "../utils/sendMails.js";

export const registerUser = async (req, res) => {
  try {
    // taking input from user(s) like username, email & password.
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      throw new Error("All fields are required.");

    // check if user with that email/username already exists, if throw error.
    const existUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (existUser && existUser.isVerified)
      throw new Error("User already exists");

    // generate token for account(email) verification.
    const verificationToken = crypto.randomBytes(32).toString("hex");
    // a url which will be sent to user via email so they can verify their account.
    // *NOT VERIFIED YET*
    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/verify/${verificationToken}`;

    // if user does exists and by chance not verified the account,
    // so this will update the token in db & will sent a verification email.
    try {
      if (existUser && !existUser.isVerified) {
        existUser.verificationToken = verificationToken;
        await existUser.save();
        await VerifyEmailMail(existUser, verificationUrl);
        return res
          .status(200)
          .json({
            success: true,
            message: `Verification Email Sent to ${existUser?.email}`,
          });
      }
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    // This is all if user doesn't exists (New User)
    // random profile image generator.
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    // if user not already exists, create user with that details and store in db.
    // storing verification token in db for further checks.
    const user = await User.create({
      username,
      email,
      password,
      profilePic: randomAvatar,
      verificationToken,
      isVerified: false,
      isOnboarded: false,
    });

    //sending verificationn email.
    await VerifyEmailMail(user, verificationUrl);

    // finding the user which just got created, so that we can use "select" method
    // for not selecting fields like password. (for testing purposes)
    const createdUser = await User.findById(user._id).select(
      "-password -verificationToken"
    );
    if (!createdUser)
      return res
        .status(500)
        .json({ success: false, message: "User creation failed" });

    // insert data into stream platform.
    try {
      await upsertStreamUser({
        id: createdUser._id.toString(),
        name: createdUser.username,
        image: createdUser.profilePic || "",
      });
      console.log(`Inserted data into stream for: ${createdUser.username}`);
    } catch (error) {
      console.log(`Error inserting data into stream: ${error}`);
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: createdUser,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    // accessing verification token through params to verify.
    const { Verifytoken } = req.params;
    if (!Verifytoken)
      return res
        .status(400)
        .json({ success: false, message: "Verification token is required" });

    // matching this token with the token stored on db, if not throw error.
    const user = await User.findOne({ verificationToken: Verifytoken });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Invalid verification token" });

    // if matched update the related fields & save the user.
    // most importantly set isVerified to true, which will be useful later.
    user.isVerified = true;
    user.isOnboarded = false;
    user.verificationToken = undefined;

    await user.save();
    await VerifyEmailSuccessMail(user); //sending success email.

    // generate a JWT token so user can access protected routes.
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // store JWT token in cookies so it can be accessed.
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const redirectTo = user?.isOnboarded
      ? `${process.env.CORS_ORIGIN}`
      : `${process.env.CORS_ORIGIN}/onboard`

    return res.redirect(302, redirectTo);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    // taking input from user(s) like email & password.
    const { email, password } = req.body;
    if (!email || !password)
      throw new Error("Email and password are required.");

    // finding user with the help of provided email, if not throw error.
    const user = await User.findOne({ email });
    if (!user) throw new Error("Email not found.");

    // check if user is verified (i.e, they verified account with the link sent via email).
    if (!user.isVerified)
      throw new Error("Please verify your email first by signing up.");

    // check the password user provided matches with the password stored in db.
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new Error("Invalid credentials.");

    // generate JWT token so user can access protected routes.
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // store JWT token in cookies so that can be accessed for checks.
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const createdUser = await User.findById(user._id).select(
      "-password -verificationToken"
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user: createdUser, token },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const onboarding = async (req, res) => {
  // *THIS IS A PROTECTED ENDPOINT, ONLY USER WHO IS VERIFIED AND
  //  HAS A JWT TOKEN CAN ACCESS ONBOARD PAGE AND MOVE FORWARD.*
  try {
    const { fullName, age, location, bio, profilePic } = req.body;

    if (!fullName || !age || !location)
      throw new Error("Fullname, age & location is required.");

    // finding the user with the currently loggedIn user ID.
    // updating extra fields like fullName, age, etc.
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          isOnboarded: true,
          fullName,
          age,
          location,
          bio,
          profilePic,
        },
      },
      {
        new: true,
      }
    );

    // if user not found, that means, they're not verified.
    if (!user) throw new Error("Verify Email first");

    // update user with new details in stream platform.
    try {
      await upsertStreamUser({
        id: user._id.toString(),
        name: user.fullName,
        image: user.profilePic,
      });
      console.log(`Updated data into stream for: ${user?.username}`);
    } catch (error) {
      console.log(`Error updating data into stream: ${error}`);
    }

    return res
      .status(200)
      .json({ success: true, message: "Onboarding completed!", data: user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // logout user by clearing the cookies, i.e,
    // the JWT token stored in the cookie.
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    // take email input from the user, if not throw error.
    const { email } = req.body;
    if (!email) throw new Error("Email is required");

    // find that one user which matches that email, if not throw error.
    const user = await User.findOne({email});
    if (!user) throw new Error("Email not found");

    // check if user is verified, then only they can click on forget pass.
    if (!user.isVerified) throw new Error("Verify your email first.");

    // generate a forget token & its expiry and save in db.
    const forgetPasswordToken = crypto.randomBytes(32).toString("hex");
    const forgetPasswordExpiry = Date.now() + 1000 * 60 * 15; // 15 minutes from now

    user.forgetPasswordToken = forgetPasswordToken;
    user.forgetPasswordExpiry = forgetPasswordExpiry;

    await user.save({ validateBeforeSave: false });

    // a link which will be sent to user via email so they can change their pass.
    // *NOT CHANGED YET*
    const resetLink = `${process.env.CORS_ORIGIN}/reset-password/${forgetPasswordToken}`;

    await ForgerPasswordLinkMail(user, resetLink); // sending reset email

    return res.status(200).json({
      success: true,
      message: "Password reset link sent successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    // accessing reset token through params to change password.
    const { resetToken } = req.params;
    // taking password & confirmPassword as a input from user.
    const { password } = req.body;

    // some checks.
    if (!resetToken) throw new Error("Invalid or missing reset token");
    if (!password)
      return res
        .status(400)
        .json({ success: false, message: "Password field is required." });

    // finding the user with the provided token and valid expiry time,
    // that matches with the one stored in db.
    const user = await User.findOne({
      forgetPasswordToken: resetToken,
      forgetPasswordExpiry: { $gt: Date.now() },
    });

    //  throw error if not found.
    if (!user) throw new Error("Invalid or expired token.");

    // update with the new password & save in db.
    user.password = password;
    user.forgetPasswordToken = undefined;
    user.forgetPasswordExpiry = undefined;

    await user.save();
    await PasswordResetSuccessMail(user); //sending success email.

    return res
      .status(200)
      .json({ success: true, message: "Passoword Reset successfull" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    // get user by entering the _id in params.
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    const user = await User.findById(id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// export const getCurrentUser = async (req, res) => {
//   try {
//     // get currently loggedIn user details.
//     const user = await User.findById(req.user._id).select("username fullName");

//     return res.status(200).json({data: user});
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error."});
//   }
// };

export const deleteAccount = async (req, res) => {
  try {
    // find user which is currently loggedIn and delete the account.
    await User.findByIdAndDelete(req.user._id);
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    return res
      .status(200)
      .json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const status = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "isVerified isOnboarded"
    );

    if (!user) throw new Error("Not authorized");

    return res.status(200).json({
      success: true,
      data: {
        isVerified: user.isVerified,
        isOnboarded: user.isOnboarded,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
