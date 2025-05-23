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
        const video = await Video.findByIdAndUpdate(req.params.id);
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