import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: "User"
    },
    videoId: {
        type:String,
        required: true,
        ref: "Video"
    },
    text: {
        type: String,
        required: true
    },
}, {timestamps: true});

export default mongoose.model("Comment", commentSchema);