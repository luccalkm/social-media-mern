import express from "express";
import { getFeedPosts, getUserPosts, handleLikePost } from "../controllers/posts.ts";
import { verifyToken } from "../middleware/auth.ts";

const router = express.Router();

// read
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getFeedPosts);

// update
router.patch("/:id/like", verifyToken, handleLikePost);

export default router;
