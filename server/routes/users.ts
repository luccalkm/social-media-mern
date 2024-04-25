import express, { Router } from "express";
import { verifyToken } from "../middleware/auth.ts";
import {
    getUser,
    getUserFriends,
    addOrRemoveFriend
} from '../controllers/users.ts';

const router: Router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addOrRemoveFriend);

export default router;

