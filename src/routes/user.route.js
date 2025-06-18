import express from "express";
import {
  acceptRequest,
  getAllRequests,
  getMyFriends,
  searchUsers,
  sendFriendReq,
  suggestFriends,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/search", searchUsers);

router.get("/suggest-friends", suggestFriends);
router.get("/my-friends", getMyFriends);

router.get("/requests", getAllRequests);

router.post("/request/:id/send", sendFriendReq);
router.put("/request/:id/accept", acceptRequest);

export default router;
