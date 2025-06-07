import cloudinary from "../config/cloudinary.js";

export const uploadSign = (req, res) => {
    try {
    const { folder,  resource_type } = req.body;

    const timestamp = Math.round(new Date().getTime() / 1000); 

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder || 'youtube_clone_uploads',
        upload_preset: 'youtube-clone' 
      },
      process.env.CLOUDINARY_API_SECRET 
    );

    res.json({
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY, 
      cloudname: process.env.CLOUDINARY_CLOUD_NAME, 
      folder,
      upload_preset: 'youtube-clone'
    });
  } catch (error) {
    console.error('Error generating Cloudinary upload signature:', error);
    res.status(500).json({ message: 'Failed to generate upload signature', error: error.message });
  }
}