import express from "express";
import {
  deleteAccount,
  forgetPassword,
  getUser,
  loginUser,
  logoutUser,
  onboarding,
  registerUser,
  resetPassword,
  status,
  verifyUser,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.get("/verify/:Verifytoken", verifyUser);

router.post("/onboarding", authMiddleware, onboarding);

router.post("/login", loginUser);
router.patch("/logout", authMiddleware, logoutUser);

router.post("/forget-password", forgetPassword);
router.post("/reset-password/:resetToken", resetPassword);

router.get("/user/:id", getUser);
router.delete("/delete", authMiddleware, deleteAccount);

router.get("/status", authMiddleware, status);

router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

export default router;
