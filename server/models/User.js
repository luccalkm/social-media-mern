"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
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
var User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
