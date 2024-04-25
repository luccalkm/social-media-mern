import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
    userId: string,
    firstName: string,
    lastName: string,
    location: string,
    description: string,
    userPicturePath: string,
    picturePath: string,
    likes: Map<String, Boolean>,
    comments: String[]
}

const PostSchema: Schema = new Schema<IPost>({
    userId: {
        type: String,
        required: true,
    },
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
    location: String,
    description: String,
    userPicturePath: String,
    picturePath: String,
    likes: {
        type: Map,
        of: Boolean,
    },
    comments: {
        types: Array,
        default: []
    },
}, { timestamps: true });

const Post = mongoose.model<IPost>("Post", PostSchema);
export default Post;