import { Request, Response } from "express";
import User, { IUser } from "../models/User";

const findUserById = async (id: string): Promise<IUser | null> => {
    const user = await User.findById(id);
    return user;
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await findUserById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getUserFriends = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await findUserById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const friends = await Promise.all(
            user.friends.map((id: string) => findUserById(id))
        );

        res.status(200).json(friends);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const addRemoveFriend = async (req: Request, res: Response) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id) as IUser | null;
        
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const friend = await User.findById(friendId) as IUser | null;
        
        if (!friend) {
            return res.status(404).json({ message: "Friend not found." });
        }

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((friend) => friend.toString() !== friendId);
            friend.friends = friend.friends.filter((friend) => friend.toString() !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const formattedFriends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        ) as IUser[];

        const formattedResponse = formattedFriends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return { _id, firstName, lastName, occupation, location, picturePath };
        });

        res.status(200).json(formattedResponse);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

