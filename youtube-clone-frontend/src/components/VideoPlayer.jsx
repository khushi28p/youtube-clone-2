import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { fetchSuccess, like, dislike } from '../redux/videoSlice';
import { subscription } from '../redux/userSlice';
import { format } from 'timeago.js'; 
import { AiOutlineShareAlt, AiOutlineDownload } from 'react-icons/ai'; 
import { MdVerified } from 'react-icons/md'; 
import {BsThreeDots} from 'react-icons/bs';
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import Comment from './Comment';

const VideoPlayer = ({videoId}) => {
    const {currentUser} = useSelector((state) => state.user);
    const {currentVideo} = useSelector((state) => state.video);
    const dispatch = useDispatch();

    const [channel, setChannel] = useState({});

    useEffect(() => {
        const fetchChannel= async() => {
          if (currentVideo && currentVideo.userId) {
            const channelId = currentVideo.userId;

            const headers = {};
            if (currentUser && currentUser.token) {
                headers.Authorization = `Bearer ${currentUser.token}`;
            }
            try{    
                  const channelRes = await axios.get(
                        `http://localhost:5000/api/users/find/${channelId}`,
                        { headers } 
                    );
                    setChannel(channelRes.data);
            } catch(error){
                console.log(error);   
            }
          }
        }

        fetchChannel();
    }, [currentVideo, currentUser]);

    const handleLike = async() => {
      if (!currentUser) {
            alert("Please log in to like videos!");
            return;
        }

          await axios.put(`http://localhost:5000/api/users/like/${currentVideo._id}`, {}, {headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }});
          dispatch(like(currentUser._id))
    }

    const handleDislike = async() => {
      if (!currentUser) {
            alert("Please log in to dislike videos!");
            return;
        }
      
          await axios.put(`http://localhost:5000/api/users/dislike/${currentVideo._id}`, {}, {headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }});
          dispatch(dislike(currentUser._id))
    
    }

    const handleSubscribe = async() => {
      currentUser.subscribedUsers.includes(channel._id) ? 
      await axios.put(`http://localhost:5000/api/users/unsub/${channel._id}`, {}, {headers : {'Authorization': `Bearer ${currentUser.token}`}}) :
      await axios.put(`http://localhost:5000/api/users/sub/${channel._id}`, {}, {headers : {'Authorization': `Bearer ${currentUser.token}`}});
      dispatch(subscription(channel._id));
    }

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
      {currentVideo?.videoUrl ? (
                    <video
                        className="absolute top-0 left-0 w-full h-full object-cover" 
                        src={currentVideo.videoUrl}
                        controls
                        poster={currentVideo.imgUrl} 
                        preload="auto" 
                        title={currentVideo?.title} 
                        autoPlay 
                        loop 
                    >
                    </video>
                ) : (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                        Video URL not available.
                    </div>
                )}
      {/* <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={currentVideo.videoUrl}
        title={currentVideo.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe> */}
    </div>
    {/* Video Title */}
      <h1 className="text-xl font-bold mb-3 mt-4">
        {currentVideo.title}
      </h1>

      {/* Channel Info and Actions */}
      <div className="flex justify-between md:items-center mb-2 flex-wrap gap-y-3 gap-x-6">
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
            <button onClick={handleSubscribe} className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90">
              {currentUser.subscribedUsers?.includes(channel._id) ? "Subscribed" : "Subscribe"}
            </button>
          </div>
        </div>

        {/* Right Section: Video Actions (Likes, Share, Download, More) */}
        <div className="flex items-center gap-3 text-gray-200 text-base">
          {/* Likes/Dislikes Group */}
          <div className="flex items-center bg-zinc-900 rounded-full overflow-hidden">
                        <button onClick={handleLike} className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-800 cursor-pointer">
                            {
                              currentVideo.likes?.includes(currentUser._id) ? (
                                <BiSolidLike className='text-xl' />
                              ) : (
                                <BiLike className='text-xl' />
                              )
                            } {" "}
                            <span className="text-sm font-semibold">{formatNumber(currentVideo?.likes?.length)}</span>
                        </button>
                        <div className="h-6 w-[1px] bg-zinc-700"></div> {/* Vertical separator */}
                        <button onClick={handleDislike} className="flex items-center px-4 py-2 hover:bg-zinc-800 cursor-pointer">
                            {
                              currentVideo.dislikes?.includes(currentUser._id) ? (
                                <BiSolidDislike className='text-xl' />
                              ) : (
                                <BiDislike className='text-xl' />
                              )
                            }
                        </button>
                    </div>
                    {/* Share Button */}
                    <button className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full hover:bg-zinc-800 cursor-pointer">
                        <AiOutlineShareAlt className="text-xl" /> 
                        <span className="text-sm font-semibold">Share</span>
                    </button>

                    {/* Download Button */}
                    {/* <button className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full hover:bg-zinc-800 cursor-pointer">
                        <AiOutlineDownload className="text-xl" /> 
                        <span className="text-sm font-semibold">Download</span>
                    </button> */}

                    {/* More options button */}
                    <button className="bg-zinc-900 hover:bg-zinc-800 p-2 rounded-full w-10 h-10 flex items-center justify-center">
                        <BsThreeDots className="text-xl" /> {/* Changed icon to BsThreeDots for better resemblance */}
                    </button>
        </div>
      </div>

      {/* Video Description Box */}
            <div className="bg-zinc-900 rounded-lg p-4 mt-2 text-sm text-gray-200">
                <div className="flex items-center gap-3 mb-2 font-semibold">
                    <span>{formatNumber(currentVideo?.views)} views</span>
                    <span>{format(currentVideo.createdAt)}</span>
                </div>
                <p className="whitespace-pre-line leading-relaxed">
                    {currentVideo?.description?.split('\n')[0]}
                    {currentVideo?.description?.split('\n').length > 1 && (
                        <span className="text-blue-400 cursor-pointer"> ...more</span>
                    )}
                </p>
            </div>

            <Comment videoId={currentVideo._id} />
    </div>
  )
}

export default VideoPlayer
