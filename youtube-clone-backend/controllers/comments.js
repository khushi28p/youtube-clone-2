import Comment from "../models/comment.js";
import Video from "../models/video.js";

export const addComment = async(req, res) => {
    try{
        const newComment = await Comment.create({
            ...req.body,
            userId: new mongoose.Types.ObjectId(req.user.id), 
            videoId: new mongoose.Types.ObjectId(req.body.videoId) 
        });
        res.status(200).json({message: "Comment added successfully!!!"}, newComment);
    } catch(error){
        res.status(500).json({message: "Internal server error"});
    }
}

export const deleteComment = async(req, res) => {
    try{
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }

        const video = await Video.findById(comment.videoId);
        const reqUserId = new mongoose.Types.ObjectId(req.user.id); 

        if(reqUserId.equals(comment.userId) || (video && reqUserId.equals(video.userId))){ // Use .equals() for ObjectId comparison
            await Comment.findByIdAndDelete(req.params.id);
            res.status(200).json({message: "Comment deleted successfully!!!"});
        }
        else{
            res.status(403).json({message: "You can only delete your comments or comments on your videos!!!"});
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