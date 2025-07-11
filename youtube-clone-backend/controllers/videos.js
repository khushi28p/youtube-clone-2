import User from "../models/user.js";
import Video from "../models/video.js"
import mongoose from "mongoose";

export const addVideo = async(req, res) => {
    const newVideo = new Video({
        userId: req.user.id, ...req.body
    });

    try{
        const savedVideo = await newVideo.save();
        res.status(200).json(savedVideo);
    }
    catch(error){
        res.status(500).json({message: "Internal server error"});   
    }
}

export const updateVideo = async(req, res) => {
    try{
        const video = await Video.findById(req.params.id);
        if(!video) return res.status(404).json({message: "Video not found"});

        if(req.user.id === video.userId){
            const updatedVideo = await Video.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {new: true});
            res.status(200).json(updatedVideo);
        }
        else{
            res.status(403).json({message: "You can only update your videos!"});
        }
    }
    catch(error){
        res.status(500).json({message: "Internal server error"});   
    }
}

export const deleteVideo = async(req, res) => {
    try{
        const video = await Video.findById(req.params.id);
        if(!video) return res.status(404).json({message:"Video not found!"});
        if(req.user.id === video.userId){
            await Video.findByIdAndDelete(req.params.id);
            res.status(200).json({message: "Video deleted successdully!!"});
        } else{
            res.status(403).json({message: "You can only delete your videos!"})
        }
    }
    catch(error){
        res.status(500).json({message: "Internal server error"});   
    }
}

export const getVideo = async(req, res) => {
    try{
        const video = await Video.findById(req.params.id);
        res.status(200).json(video);
    }
    catch(error){
        res.status(500).json({message: "Internal server error"});   
    }
}

export const addView = async(req, res) => {
    try{
        await Video.findByIdAndUpdate(req.params.id, {
            $inc: {
                views: 1
            }
        })

        res.status(200).json({message: "The view has been increased"});
    } catch(error){
        res.status(500).json({message: "Internal server error"});
    }
}

export const getTrending = async(req, res) => {
    try{
        const videos = await Video.find().sort({views: -1}).populate("userId", "channelName profilePicture");
        res.status(200).json(videos);
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
}

export const getRandom = async(req, res) => {
    try{
        const videos = await Video.aggregate([{$sample: {size: 40}}]);
        const videoIds = videos.map(video => video._id);
        const populatedVideos = await Video.find({_id: {$in: videoIds}}).populate("userId", "channelName profilePicture");

        res.status(200).json(populatedVideos);
    } catch(error){
        res.status(500).json({message: "Internal server error"});
    }
}

    export const getSubscribed = async(req, res) => {
        try{
            const user = await User.findById(req.user.id);
            const subscribedChannels = user.subscribedUsers;

            const videos = await Video.find({userId: {$in: subscribedChannels}}).populate("userId", "channelName profilePicture");
            const sortedVideos = videos.sort((a,b) => b.createdAt - a.createdAt)

            res.status(200).json(sortedVideos);
        } catch(error){
            res.status(500).json({message: "Internal server error"});
        }
    }

export const getByTags = async(req, res) => {
    const tags = req.query.tags.split(",");
    try{
        const videos = await Video.find({tags: {$in: tags}}).populate("userId", "channelName").limit(20);
        res.status(200).json(videos);
    } catch(error){
        res.status(500).json({message:"Internal server error"});
    }

}

export const search = async(req, res) => {
    const query = req.query.q;
    try{
        const videos = await Video.find({title: {$regex: query, $options:"i"}}).populate("userId", "channelName profilePicture").limit(40);
        res.status(200).json(videos);
    } catch(error){
        res.status(500).json({message: "Internal server error"});
    }
}

export const getVideosByChannel = async(req, res) => {
    try{
        const userId = req.params.userId;
        const id = new mongoose.Types.ObjectId(userId);
        const videos = await Video.find({userId: id}).sort({createdAt: -1});
        res.status(200).json(videos);
    } catch(error){
        res.status(500).json({message: "Internal server error"});
    }
}