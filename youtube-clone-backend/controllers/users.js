import User from "../models/user.js";

export const updateUser = async(req, res, next) => { 
    if(req.params.id === req.user.id){
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                $set: res.body
            }, {
                new: true
            })
            res.status(200).json(updatedUser)
        } catch(error){
            res.status(500).json({message: "Internal server error"});
        }
    }
}

export const deleteUser = async(req, res, next) => {
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

}

export const subscribeUser = async(req, res) => {

}

export const unsubscribeUser = async(req, res) => {

}

export const likeVideo = async(req, res) => {

}

export const dislikeVideo = async(req, res) => {
    
}