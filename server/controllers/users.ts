import { Request, Response } from "express";
import User, { IUser } from "../models/User.ts";
import { handleErrorResponse, handleNotFoundResponse } from "../middleware/general.ts";

const findUserById = async (id: string): Promise<IUser | null> => {
    return await User.findById(id);
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await findUserById(id);
        if (!user) {
            return handleNotFoundResponse(res, "Usuário não encontrado.");
        }
        res.status(200).json(user);
    } catch (err) {
        handleErrorResponse(res, err);
    }
};

export const getUserFriends = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await findUserById(id);
        if (!user) {
            return handleNotFoundResponse(res, "Usuário não encontrado.");
        }

        const friends = await Promise.all(
            user.friends.map(findUserById)
        );
        res.status(200).json(friends);
    } catch (err) {
        handleErrorResponse(res, err);
    }
};

export const addOrRemoveFriend = async (req: Request, res: Response) => {
    try {
        const { id, friendId } = req.params;
        const user = await findUserById(id);
        const friend = await findUserById(friendId);

        if (!user) {
            return handleNotFoundResponse(res, "Usuário não encontrado.");
        }

        if (!friend) {
            return handleNotFoundResponse(res, "Amigo não encontrado.");
        }

        const isFriend = user.friends.includes(friendId);

        if (isFriend) {
            await removeFriend(req, res);
        } else {
            await addFriend(req, res);
        }
    } catch (err) {
        handleErrorResponse(res, err);
    }
};

const addFriend = async (req: Request, res: Response) => {
    try {
        const { id, friendId } = req.params;
        const user = await findUserById(id);
        const friend = await findUserById(friendId);

        if (!user) {
            return handleNotFoundResponse(res, "Usuário não encontrado.");
        }

        if (!friend) {
            return handleNotFoundResponse(res, "Amigo não encontrado.");
        }

        if (!user.friends.includes(friendId)) {
            user.friends.push(friendId);
            friend.friends.push(id);
            await user.save();
            await friend.save();
        }

        const formattedFriends = await Promise.all(
            user.friends.map(findUserById)
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        handleErrorResponse(res, err);
    }
};

const removeFriend = async (req: Request, res: Response) => {
    try {
        const { id, friendId } = req.params;
        const user = await findUserById(id);
        const friend = await findUserById(friendId);

        if (!user) {
            return handleNotFoundResponse(res, "Usuário não encontrado.");
        }

        if (!friend) {
            return handleNotFoundResponse(res, "Amigo não encontrado.");
        }

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((friend) => friend.toString() !== friendId);
            friend.friends = friend.friends.filter((friend) => friend.toString() !== id);
            await user.save();
            await friend.save();
        }

        const formattedFriends = await Promise.all(
            user.friends.map(findUserById)
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        handleErrorResponse(res, err);
    }
};
