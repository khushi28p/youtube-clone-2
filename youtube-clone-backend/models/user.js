import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: [true, "Channel name is required"],
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        message: "Password must contain at least 6 characters",
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
    subscribers: {
        type: Number,
        default: 0,
    },
    subscribedUsers: [
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
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video',
        }
    ],
    dislikes:[
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

export default mongoose.model('User', userSchema);