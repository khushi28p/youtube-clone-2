import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../redux/userSlice'; 
import {UserCircleIcon} from '@heroicons/react/24/outline';
import { BASE_URL } from '../config';

const ChannelCustomization = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null); 
  const [bannerImageFile, setBannerImageFile] = useState(null);       

  const [newProfilePictureUrl, setNewProfilePictureUrl] = useState(null);
  const [newBannerImageUrl, setNewBannerImageUrl] = useState(null);

  const [currentProfilePictureUrl, setCurrentProfilePictureUrl] = useState('');
  const [currentBannerImageUrl, setCurrentBannerImageUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploading, setUploading] = useState(false);    

  useEffect(() => {
    const fetchChannelDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/users/find/${currentUser._id}`);
        const data = res.data;
        setChannelName(data.channelName || '');
        setDescription(data.description || '');
        setCurrentProfilePictureUrl(data.profilePicture || '');
        setCurrentBannerImageUrl(data.bannerImage || '');
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch channel details:", err);
        setError("Failed to load channel details.");
        setLoading(false);
      }
    };

    fetchChannelDetails();
  }, [currentUser]);

  const uploadFileToCloudinary = async (file, folderName) => {
    if (!file) return null; 

    setUploading(true);
    try {
      const { data: signatureData } = await axios.post(`${BASE_URL}/upload/sign`, {
        folder: folderName,
        resource_type: 'image', 
      }, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`, 
        }
      });

      const { signature, timestamp, api_key, cloudname, upload_preset } = signatureData;

      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', file);
      cloudinaryFormData.append('api_key', api_key);
      cloudinaryFormData.append('signature', signature);
      cloudinaryFormData.append('timestamp', timestamp);
      cloudinaryFormData.append('folder', folderName);
      cloudinaryFormData.append('upload_preset', upload_preset); 

      const cloudinaryUploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudname}/image/upload`,
        cloudinaryFormData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`${folderName} upload progress: ${percentCompleted}%`);
          },
        }
      );

      return cloudinaryUploadRes.data.secure_url; 
    } catch (uploadError) {
      console.error(`Error uploading ${folderName} to Cloudinary:`, uploadError.response?.data || uploadError.message);
      setError(`Failed to upload ${folderName}. Please try again.`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e, setFile, setPreviewUrl, setNewUrl) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
      setNewUrl(null); 
    } else {
      setFile(null);
      setPreviewUrl('');
      setNewUrl(null);
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePictureFile('REMOVE'); 
    setCurrentProfilePictureUrl('');
    setNewProfilePictureUrl(''); 
  };

  const handleRemoveBannerImage = () => {
    setBannerImageFile('REMOVE'); 
    setCurrentBannerImageUrl('');
    setNewBannerImageUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let finalProfilePictureUrl = currentProfilePictureUrl;
      let finalBannerImageUrl = currentBannerImageUrl;

      if (profilePictureFile && profilePictureFile !== 'REMOVE') {
        const uploadedUrl = await uploadFileToCloudinary(profilePictureFile, 'profile_pictures');
        if (uploadedUrl) {
          finalProfilePictureUrl = uploadedUrl;
        } else {
          setLoading(false);
          return;
        }
      } else if (profilePictureFile === 'REMOVE') {
        finalProfilePictureUrl = null; 
      }

      if (bannerImageFile && bannerImageFile !== 'REMOVE') {
        const uploadedUrl = await uploadFileToCloudinary(bannerImageFile, 'banner_images');
        if (uploadedUrl) {
          finalBannerImageUrl = uploadedUrl;
        } else {
          setLoading(false);
          return;
        }
      } else if (bannerImageFile === 'REMOVE') {
        finalBannerImageUrl = null; 
      }

      const updateData = {
        channelName: channelName,
        description: description,
        profilePicture: finalProfilePictureUrl,
        bannerImage: finalBannerImageUrl,
      };

      const res = await axios.put(`${BASE_URL}/users/${currentUser._id}`, updateData, {
        headers: {
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      dispatch(loginSuccess(res.data));
      setSuccess("Channel updated successfully!");
      setLoading(false);
      navigate(`/channel/${currentUser._id}`); 
    } catch (err) {
      console.error("Failed to update channel:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update channel. Please try again.");
      setLoading(false);
    }
  };

  if (loading && !channelName) { 
    return <div className="text-white text-center mt-8">Loading customization options...</div>;
  }

  return (
    <div className="bg-black min-h-[calc(100vh-4rem)] px-16 py-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Channel Customization</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Banner Image Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Banner image</h2>
          <p className="text-zinc-400 text-sm mb-4">This image will appear across the top of your channel</p>
          <div className="flex items-center space-x-6">
            <div className="w-48 h-24 bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
              {currentBannerImageUrl ? (
                <img src={currentBannerImageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-zinc-500 text-xs">No banner</span>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-zinc-400 text-xs">For best results on all devices, use an image that's at least 2048 x 1152 pixels and 6MB or less.</p>
              <input
                type="file"
                id="bannerImage"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setBannerImageFile, setCurrentBannerImageUrl, setNewBannerImageUrl)}
                className="hidden"
              />
              <div className="flex space-x-2">
                <label htmlFor="bannerImage" className="py-2 px-4 rounded-full font-semibold text-sm bg-zinc-700 text-white cursor-pointer hover:bg-zinc-600">
                  Change
                </label>
                <button
                  type="button"
                  onClick={handleRemoveBannerImage}
                  className="py-2 px-4 rounded-full font-semibold text-sm bg-zinc-700 text-white hover:bg-zinc-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-zinc-700" />

        {/* Profile Picture Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Picture</h2>
          <p className="text-zinc-400 text-sm mb-4">Your profile picture will appear where your channel is presented on YouTube, like next to your videos and comments</p>
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden">
              {currentProfilePictureUrl ? (
                <img src={currentProfilePictureUrl} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <UserCircleIcon className="h-16 w-16 text-zinc-500" />
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-zinc-400 text-xs">It's recommended to use a picture that's at least 98 x 98 pixels and 4MB or less. Use a PNG or GIF (no animations) file. Make sure your picture follows the YouTube Community Guidelines.</p>
              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setProfilePictureFile, setCurrentProfilePictureUrl, setNewProfilePictureUrl)}
                className="hidden"
              />
              <div className="flex space-x-2">
                <label htmlFor="profilePicture" className="py-2 px-4 rounded-full font-semibold text-sm bg-zinc-700 text-white cursor-pointer hover:bg-zinc-600">
                  Change
                </label>
                <button
                  type="button"
                  onClick={handleRemoveProfilePicture}
                  className="py-2 px-4 rounded-full font-semibold text-sm bg-zinc-700 text-white hover:bg-zinc-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-zinc-700" />

        {/* Name and Description Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Name</h2>
          <p className="text-zinc-400 text-sm mb-4">Choose a channel name that represents you and your content. Changes made to your name and picture are visible only on YouTube and not other Google services. You can change your name twice in 14 days.</p>
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Channel Name"
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-blue-500 text-white mb-4"
          />

          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-zinc-400 text-sm mb-4">Tell viewers about your channel. Your description will appear in the About section of your channel and search results, among other places.</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell viewers about your channel..."
            rows="5"
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-blue-500 text-white resize-y mb-4"
          ></textarea>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        {uploading && <p className="text-blue-400 text-sm">Uploading images...</p>}


        <button
          type="submit"
          disabled={loading || uploading} // Disable if overall loading or images are uploading
          className="py-2 px-8 rounded-full font-semibold text-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {(loading || uploading) ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ChannelCustomization;