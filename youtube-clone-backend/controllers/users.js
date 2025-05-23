import User from "../models/user.js";

export const updateUser = async(req, res) => { 
    if(req.params.id === req.user.id){
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body
            }, {
                new: true
            })
            res.status(200).json(updatedUser)
        } catch(error){
            res.status(500).json({message: "Internal server error"});
        }
    }
}

export const deleteUser = async(req, res) => {
    if(req.params.id === req.user.id){
        try{
            await User.findByIdAndDelete(
                req.params.id,
            )
            res.status(200).json({message:"User deleted successfully!!"})
        } catch(error){
            res.status(500).json({message: "Internal server error"});
        }
    }
}

export const getUser = async(req, res) => {
    try{
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch(error){
        res.status(500).json({message: "Internal server error"});
    }
}

export const subscribeUser = async(req, res) => {
    try{
        await User.findById(req.user.id, {
            $push: {subscribedUsers: req.params.id}
        });

        await User.findByIdAndUpdate(req.params.id, {
            $inc: {subscribers: 1}
        });

        res.status(200).json({message: "Subscribed successfully!!!"});
    } catch(error){
        res.status(500).json({message: "Internal server error"});
    }
}

export const unsubscribeUser = async(req, res) => {
    try{
        await User.findById(req.user.id, {
            $pull: {subscribedUsers: req.params.id}
        })
        await User.findByIdAndUpdate(req.params.id,
            {
                $dec: {subscribers: -1}
            }
        );
        res.status(200).json({message: "Unsubscribed successfully!!"});
    } catch(error){
        res.status(500).json({message: "Internal server error"});
    }
}

export const likeVideo = async(req, res) => {

}

export const dislikeVideo = async(req, res) => {
    
}