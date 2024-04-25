import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from 'dotenv';
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.ts";
import userRoutes from "./routes/users.ts";
import postsRoutes from "./routes/posts.ts";
import { register } from "./controllers/auth.ts";
import { createPost } from "./controllers/posts.ts"
import { verifyToken } from "./middleware/auth.ts";
import User from "./models/User.ts";
import Post from "./models/Post.ts";
import { users, posts } from "./data/index.js";


// Configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// File storage
const storage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, "public/assets");
    },
    filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// ROUTES WITH FILES
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost)

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postsRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL || 'chill', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as mongoose.ConnectOptions).then(() => {
    app.listen(PORT, () => { console.log("Server running on port " + PORT); });
    initializeData();
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});

async function initializeData() {
    const usersExist = await User.countDocuments();
    const postsExist = await Post.countDocuments();

    if (!usersExist) {
        User.insertMany(users).catch(err => {
            console.log('Error adding users:', err);
        });
    }

    if (!postsExist) {
        Post.insertMany(posts).catch(err => {
            console.log('Error adding posts:', err);
        });
    }
}