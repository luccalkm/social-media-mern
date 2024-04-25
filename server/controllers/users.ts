import { Request, Response } from "express";
import User, { IUser } from "../models/User";

const findUserById = async (id: string): Promise<IUser | null> => {
    return await User.findById(id);
};

const handleErrorResponse = (res: Response, error: any) => {
    res.status(500).json({ message: error.message });
};

const handleNotFound = (res: Response, message: string) => {
    return res.status(404).json({ message });
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await findUserById(id);
        if (!user) {
            return handleNotFound(res, "Usuário não encontrado.");
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
            return handleNotFound(res, "Usuário não encontrado.");
        }

        const friends = await Promise.all(
            user.friends.map(findUserById)
        );
        res.status(200).json(friends);
    } catch (err) {
        handleErrorResponse(res, err);
    }
};

export const addFriend = async (req: Request, res: Response) => {
    try {
        const { id, friendId } = req.params;
        const user = await findUserById(id);
        const friend = await findUserById(friendId);

        if (!user) {
            return handleNotFound(res, "Usuário não encontrado.");
        }

        if (!friend) {
            return handleNotFound(res, "Amigo não encontrado.");
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

export const removeFriend = async (req: Request, res: Response) => {
    try {
        const { id, friendId } = req.params;
        const user = await findUserById(id);
        const friend = await findUserById(friendId);

        if (!user) {
            return handleNotFound(res, "Usuário não encontrado.");
        }

        if (!friend) {
            return handleNotFound(res, "Amigo não encontrado.");
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


// export const addRemoveFriend = async (req: Request, res: Response) => {
//     try {
//         const { id, friendId } = req.params;
//         const user = await findUserById(id);
//         const friend = await findUserById(friendId);

//         if (!user || !friend) {
//             return handleNotFound(res, !user ? "Usuário não encontrado." : "Amigo não encontrado.");
//         }

//         const isFriend = user.friends.includes(friendId);
//         if (isFriend) {
//             user.friends = user.friends.filter((friend) => friend.toString() !== friendId);
//             friend.friends = friend.friends.filter((friend) => friend.toString() !== id);
//         } else {
//             user.friends.push(friendId);
//             friend.friends.push(id);
//         }

//         await user.save();
//         await friend.save();

//         const formattedFriends = await Promise.all(
//             user.friends.map(id => findUserById(id))
//         );
//         res.status(200).json(formattedFriends);
//     } catch (err) {
//         handleErrorResponse(res, err);
//     }
// };
