import Comment from "../models/comment.js";
import Video from "../models/video.js";

export const addComment = async(req, res) => {
    try{
        const newComment = Comment.create({...req.body, userId: req.user.id});
        res.status(200).json({message: "Comment added successfully!!!"}, newComment);
    } catch(error){
        res.status(500).json({message: "Internal server error"});
    }
}

export const deleteComment = async(req, res) => {
    try{
        const comment = await Comment.findById(req.params.id);
        const video = await Video.findById(comment.videoId);

        if(req.user.id === comment.userId || req.user.id === video.userId){
            await Comment.findByIdAndDelete(req.params.id);
            res.status(200).json({message: "Comment deleted successfully!!!"});
        }
        else{
            res.status(403).json({message: "You can only delete your comments!!!"});
        }
    } catch(error){
        res.status(500).json({message: "Internal server error"});
    }
}

export const getComments = async(req, res) => {
    try{
        const comments = await Comment.find({videoId: req.params.videoId}).populate("userId", "channelName profilePicture");
        res.status(200).json(comments);
    } catch(error){
        res.status(500).json({message: "Internal server error"});
    }
}