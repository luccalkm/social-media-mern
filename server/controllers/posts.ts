import User from "../models/User.ts";
import { Request, Response } from "express";
import Post from "../models/Post.ts";
import { handleErrorResponse, handleNotFoundResponse } from "../middleware/general.ts";

// create
export const createPost = async(req: Request, res: Response) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return handleNotFoundResponse(res, "Usuário não encontrado.");
        }

        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        });

        await newPost.save();

        const posts = await Post.find();
        res.status(201).json(posts);
    }
    catch (err) {
        res.status(409).json({message: err.message})
    }
}

// read
export const getFeedPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        handleNotFoundResponse(res, error.message);
    }
}

export const getUserPosts = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const userPosts = await Post.find({ userId });
        res.status(200).json(userPosts);
    } catch (error) {
        handleNotFoundResponse(res, error.message);
    }
}

// update
export const handleLikePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(id, {likes: post.likes }, { new : true} );

        res.status(200).json(updatedPost);
    } catch (error) {
        handleNotFoundResponse(res, error.message);
    }
}