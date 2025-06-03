import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { fetchSuccess } from '../redux/videoSlice';
import { format } from 'timeago.js'; 
import { AiOutlineLike, AiOutlineDislike, AiOutlineShareAlt, AiOutlineDownload } from 'react-icons/ai'; 
import { MdVerified } from 'react-icons/md'; 


const VideoPlayer = () => {
    const {currentUser} = useSelector((state) => state.user);
    const {currentVideo} = useSelector((state) => state.video);
    const dispatch = useDispatch();

    const path = useLocation().pathname.split("/")[2];

    const [channel, setChannel] = useState({});

    useEffect(() => {
        const fetchData = async() => {
          console.log("fetching data for path:", path);
            try{    
                const videoRes = await axios.get(`http://localhost:5000/api/videos/find/${path}`);
                console.log(videoRes.data);
                console.log(currentUser);

                if(videoRes.data && videoRes.data.userId){
                  const channelId = videoRes.data.userId;
                    console.log("Fetching channel for userId:", channelId);

                    const headers = {};
                    if (currentUser && currentUser.token) {
                        headers.Authorization = `Bearer ${currentUser.token}`;
                        console.log("Token found in Redux, adding to headers for channel request.");
                    } else {
                        console.warn("No token found in currentUser. Channel request might fail with 401 if backend requires auth.");
                    }
                  const channelRes = await axios.get(
                        `http://localhost:5000/api/users/find/${channelId}`,
                        { headers } // <-- THIS IS THE CRITICAL CHANGE! Pass the headers here.
                    );
                    console.log("Channel Data:", channelRes.data);
                    setChannel(channelRes.data);
                } else{
                    console.warn("Video data or userId not found in video response:", videoRes.data);
                }

                dispatch(fetchSuccess(videoRes.data));
                console.log("Dispatching fetchSuccess with:", videoRes.data); 
            } catch(error){
                console.log(error);   
            }
        }

        fetchData();
    }, [path, dispatch, currentUser]);

    const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num;
  };

  return (
    <div className='flex flex-col text-white p-4'>
    <div className="relative pt-[56.25%] rounded-lg overflow-hidden">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src="https://www.youtube.com/embed/k3Vfj-e1Ma4"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
    {/* Video Title */}
      <h1 className="text-xl font-bold mb-3">
        {currentVideo.title}
      </h1>

      {/* Channel Info and Actions */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-y-3">
        {/* Left Section: Channel Details */}
        <div className="flex items-center gap-3">
          {/* Channel Avatar */}
          {channel?.profilePicture ? (
            <img
              src={channel.profilePicture}
              alt={channel.channelName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-semibold">
              {channel?.channelName ? channel.channelName[0].toUpperCase() : ''}
            </div>
          )}
          {/* Channel Name and Subscribers */}
          <div className="flex flex-col">
            <span className="font-semibold text-base flex items-center gap-1">
              {channel?.channelName}
              {channel?.isVerified && <MdVerified className="text-blue-400 text-lg" title="Verified" />}
            </span>
            <span className="text-gray-400 text-sm">
              {formatNumber(channel?.subscribers)} subscribers
            </span>
          </div>

          {/* Join and Subscribe Buttons */}
          <div className="ml-4 flex gap-2">
            {/* You'd add logic here to show/hide based on subscription status */}
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Join
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Subscribe
            </button>
          </div>
        </div>

        {/* Right Section: Video Actions (Likes, Share, Download, More) */}
        <div className="flex items-center gap-6 text-gray-400 text-lg">
          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            <AiOutlineLike className="text-2xl" />
            <span className="text-sm">{formatNumber(currentVideo.likes)}</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            <AiOutlineDislike className="text-2xl" />
            <span className="text-sm">Dislike</span> {/* Dislike count usually not shown like likes */}
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            <AiOutlineShareAlt className="text-2xl" />
            <span className="text-sm">Share</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            <AiOutlineDownload className="text-2xl" />
            <span className="text-sm">Download</span>
          </div>
          {/* More options button */}
          <button className="rounded-full bg-gray-700 hover:bg-gray-600 p-2">
            <span className="font-bold text-xl leading-none">...</span>
          </button>
        </div>
      </div>

      {/* Video Description Box */}
      <div className="bg-gray-800 rounded-lg p-4 mt-4 text-sm text-gray-200">
        <div className="flex items-center gap-3 mb-2 font-semibold">
          <span>{formatNumber(currentVideo.views)} views</span>
          <span>{format(currentVideo.createdAt)}</span> {/* Uses timeago.js */}
        </div>
        <p className="whitespace-pre-line leading-relaxed">
          {currentVideo.description?.split('\n')[0]} {/* Show first line */}
          {/* You'd typically have a "Show more" button for long descriptions */}
          {currentVideo.description?.split('\n').length > 1 && (
            <span className="text-blue-400 cursor-pointer"> ...more</span>
          )}
        </p>
      </div>
    </div>
  )
}

export default VideoPlayer
