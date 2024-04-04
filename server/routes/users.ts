import express, { Router } from "express";
import { verifyToken } from "../middleware/auth";
import {
    getUser,
    getUserFriends,
    addRemoveFriend
} from '../controllers/users';

const router: Router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
