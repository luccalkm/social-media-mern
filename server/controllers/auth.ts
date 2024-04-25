import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User, { IUser } from "../models/User.ts";

// Register user
export const register = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;

        if (!password)
            res.status(400).json({ message: "A senha precisa ser informada." });

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(email + password, salt);

        const newUser: IUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });
        const savedUser = await newUser.save();

        const userWithoutPassword = savedUser.toObject();
        delete userWithoutPassword.password;

        res.status(201).json(userWithoutPassword);

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user)
            return res.status(400).json({ msg: "Usuário não existe." });

        const isValidPassword = await bcrypt.compare(email + password, user.password!);
        if (!isValidPassword)
            return res.status(400).json({ msg: "Credenciais inválidas." });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
        delete user.password;

        res.status(200).json({ token, user });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
