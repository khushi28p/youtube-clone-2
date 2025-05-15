import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
        message: "Username must be between 3 and 20 characters",
        match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, "Please enter a valid email address"],
        message: "Email must be a valid email address",
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        message: "Password must contain at least 6 characters",
    },
    channelName: {
        type: String,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    profilePicture: {
        type: String,
        default: '',
    },
    bannerImage: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500,
        default: '',
    },
    subscribersCount: {
        type: Number,
        default: 0,
    },
    subscribedTo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video',
        }
    ],
    likedVideos:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video',
        }
    ],
    dislikedVideos:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        }
    ]
},
{
    timestamps: true,
}
);

export const User = mongoose.model('User', userSchema);