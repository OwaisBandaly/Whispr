import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/token", authMiddleware, getStreamToken);

export default router;
