import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    thumbnailUrl:{
        type: String,
        required: true,
    },
    videoUrl:{
        type: String,
        required: true,
    },
    views:{
        type: Number,
        default: 0,
    },
    tags:{
        type: [String],
        default: [],
    },
    likes:{
        type: [String],
        default: [],
    },
    dislikes:{
        type: [String],
        default: [],
    },
},
{
    timestamps: true,
})

export const Video = mongoose.model('Video', videoSchema);