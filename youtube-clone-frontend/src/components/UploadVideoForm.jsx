import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';

const UploadVideoForm = ({onClose}) => {
    const {currentUser} = useSelector((state) => state.user);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null); 
  const [videoFile, setVideoFile] = useState(null);     
   const [tags, setTags] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [success, setSuccess] = useState(false);
const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);

const token = currentUser?.token;

  // Function to handle file selection
  const handleFileChange = (e, setFileState) => {
    setFileState(e.target.files[0]);
    setError(null); 
  };

  // Generic function to upload a file to Cloudinary
  const uploadFileToCloudinary = async (file, resourceType, setProgress) => {
    if (!file) return null;

    if (!token) {
      setError("You must be logged in to upload files.");
      return null;
    }

    try {
      const signatureResponse = await axios.post(
        'http://localhost:5000/api/upload/sign', 
        { resource_type: resourceType, folder: 'youtube_clone_uploads' }, 
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json',
          },
        }
      );

      const { signature, timestamp, cloudname, api_key, folder, upload_preset } = signatureResponse.data;

      const formData = new FormData();
      formData.append('file', file); 
      formData.append('api_key', api_key);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);
      
      if (upload_preset) {
        formData.append('upload_preset', upload_preset);
      }
      formData.append('resource_type', resourceType); // 'image' or 'video'

      // Upload directly to Cloudinary's API
      const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${cloudname}/${resourceType}/upload`;
      const uploadRes = await axios.post(cloudinaryUploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
          console.log(`${file.name} upload: ${percentCompleted}%`);
        },
      });

      return uploadRes.data.secure_url;
    } catch (err) {
      console.error(`Error during ${resourceType} upload process:`, err.response?.data || err.message);
      setError(`Failed to upload ${resourceType}. Please try again.`);
      if (setProgress) setProgress(0); 
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setThumbnailUploadProgress(0);  
    setVideoUploadProgress(0);

    if (!currentUser) {
      setError("Please log in to upload videos.");
      setLoading(false);
      return;
    }

    if (!thumbnailFile || !videoFile) {
      setError("Please select both a video file and a thumbnail image.");
      setLoading(false);
      return;
    }

    try {
      // Upload Thumbnail to Cloudinary
      const uploadedThumbnailUrl = await uploadFileToCloudinary(thumbnailFile, 'image', setThumbnailUploadProgress);
      if (!uploadedThumbnailUrl) {
        setLoading(false); // Error already handled in uploadFileToCloudinary
        return;
      }

      // Upload Video to Cloudinary
      const uploadedVideoUrl = await uploadFileToCloudinary(videoFile, 'video', setVideoUploadProgress);
      if (!uploadedVideoUrl) {
        setLoading(false); // Error already handled in uploadFileToCloudinary
        return;
      }

      // Send Video Metadata (including Cloudinary URLs) to your Backend
      const videoData = {
        title,
        description,
        thumbnailUrl: uploadedThumbnailUrl, 
        videoUrl: uploadedVideoUrl,       
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''), 
      };

      const response = await axios.post(
        'http://localhost:5000/api/videos', 
        videoData,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
            onClose();
        }, 1500);
        setTitle('');
        setDescription('');
        setThumbnailFile(null);
        setVideoFile(null);
        setTags('');
        setThumbnailUploadProgress(0); 
        setVideoUploadProgress(0); 
        console.log("Video and metadata saved successfully:", response.data);
        // Optionally, redirect the user or show a link to the new video
        // navigate(`/video/${response.data._id}`);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Error submitting video to backend:", err.response?.data || err.message);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to add video. Please check your network and try again.");
      }
       setThumbnailUploadProgress(0); 
      setVideoUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      <h2 className="text-2xl font-bold text-center mb-6">Upload Your Video</h2>

      {/* Message Area */}
      {error && (
        <p className="bg-red-800 text-red-200 p-3 rounded text-center text-sm">
          {error}
        </p>
      )}
      {success && (
        <p className="bg-green-800 text-green-200 p-3 rounded text-center text-sm">
          Video uploaded successfully!
        </p>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Catchy title for your video"
          className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-200"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows="4"
          placeholder="Tell viewers about your video..."
          className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-200 resize-y"
        ></textarea>
      </div>

      {/* Thumbnail Upload */}
      <div>
        <label htmlFor="thumbnail" className="block text-sm font-medium mb-2">Thumbnail Image:</label>
        <div className="flex items-center space-x-3">
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setThumbnailFile)}
            required
            // Custom file input styling (hides default, styles label)
            className="hidden" // Hide the default input
          />
          <label htmlFor="thumbnail" className="cursor-pointer bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-4 rounded-md transition-colors text-sm">
            Choose Thumbnail
          </label>
          {thumbnailFile && (
            <span className="text-gray-400 text-sm">Selected: {thumbnailFile.name}</span>
          )}
        </div>
        {thumbnailFile && thumbnailUploadProgress > 0 && thumbnailUploadProgress < 100 && (
          <div className="w-full bg-zinc-700 rounded-full h-2.5 mt-2 relative">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${thumbnailUploadProgress}%` }}></div>
            <span className="absolute right-0 top-0 -mt-5 text-xs text-gray-400">{thumbnailUploadProgress}%</span>
          </div>
        )}
        {thumbnailFile && thumbnailUploadProgress === 100 && !error && (
            <p className="text-green-400 text-xs mt-1">Thumbnail uploaded!</p>
        )}
      </div>

      {/* Video File Upload */}
      <div>
        <label htmlFor="video" className="block text-sm font-medium mb-2">Video File:</label>
        <div className="flex items-center space-x-3">
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={(e) => handleFileChange(e, setVideoFile)}
            required
            className="hidden" // Hide the default input
          />
          <label htmlFor="video" className="cursor-pointer bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-4 rounded-md transition-colors text-sm">
            Choose Video File
          </label>
          {videoFile && (
            <span className="text-gray-400 text-sm">Selected: {videoFile.name}</span>
          )}
        </div>
        {videoFile && videoUploadProgress > 0 && videoUploadProgress < 100 && (
          <div className="w-full bg-zinc-700 rounded-full h-2.5 mt-2 relative">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${videoUploadProgress}%` }}></div>
            <span className="absolute right-0 top-0 -mt-5 text-xs text-gray-400">{videoUploadProgress}%</span>
          </div>
        )}
        {videoFile && videoUploadProgress === 100 && !error && (
            <p className="text-green-400 text-xs mt-1">Video uploaded!</p>
        )}
      </div>


      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-2">Tags (comma separated):</label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., funny, gaming, tutorial"
          className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-200"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-2 px-5 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !currentUser || !thumbnailFile || !videoFile || !title || !description}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading & Saving...' : 'Upload Video'}
        </button>
      </div>
    </form>
  );
}

export default UploadVideoForm
