import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    picturePath: string;
    friends: string[];
    location?: string;
    occupation?: string;
    viewedProfile?: number;
    impressions?: number;
}

const UserSchema: Schema = new Schema<IUser>({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    picturePath: {
        type: String,
        default: "",
    },
    friends: {
        type: [String],
        default: [],
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
}, { timestamps: true });

const User = mongoose.model<IUser>("User", UserSchema);
export default User;