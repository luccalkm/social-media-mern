import express, { Router } from "express";
import { Request, Response } from "express";
import { login } from "../controllers/auth";

const router: Router = express.Router();

router.post("/login", (req: Request, res: Response) => {
    login(req, res);
});

export default router;
