import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IUser } from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.header("Authorization");

        if (!token)
            return res.status(403).send("Acesso negado.");

        if (token.startsWith("Bearer "))
            token = token.slice(7, token.length).trimLeft();

        const verified = jwt.verify(token, process.env.JWT_SECRET!);

        req.user = verified as IUser;

        next();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
