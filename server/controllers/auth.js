import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register user
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.Body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(email + password, salt);

        const newUser = new User({
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

        const { firstName, lastName, email, picturePath, friends, location, occupation } = savedUser;
        
        res.status(201).json(savedUser);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.Body;
        const user = await User.findOne({ email: email });

        if (!user)
            return res.status(400).json({ msg: "User does not exist." });

        const isValidPassword = await bcrypt.compare(email + password, user.password);
        if (!isValidPassword)
            return res.status(400).json({ msg: "Invalid credentials." });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        delete user.password;

        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};