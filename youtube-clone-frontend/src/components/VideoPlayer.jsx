import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { fetchSuccess, like, dislike } from '../redux/videoSlice';
import { subscription } from '../redux/userSlice';
import { format } from 'timeago.js';
import { AiOutlineShareAlt } from 'react-icons/ai';
import { MdVerified } from 'react-icons/md';
import { BsThreeDots } from 'react-icons/bs';
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import Comment from './Comment';

const VideoPlayer = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user || {});
  const { currentVideo } = useSelector((state) => state.video || {});
  const dispatch = useDispatch();

  const [channel, setChannel] = useState(null); // Initialize as null to handle loading state

  useEffect(() => {
    const fetchChannel = async () => {
      if (currentVideo && currentVideo.userId) {
        const channelId = currentVideo.userId;
        try {
          const channelRes = await axios.get(
            `http://localhost:5000/api/users/find/${channelId}`
          );
          setChannel(channelRes.data);
        } catch (error) {
          console.warn("Error fetching channel data:", error);
          setChannel(null); // Set to null on error
        }
      } else {
        setChannel(null); // Clear channel state if no video or userId
      }
    };

    fetchChannel();
  }, [currentVideo]); // Depend on currentVideo to refetch channel info if video changes

  const handleLike = async () => {
    if (!currentUser) {
      alert("Please log in to like videos!");
      return;
    }
    if (!currentVideo) return; // Ensure video is loaded

    try {
      await axios.put(`http://localhost:5000/api/users/like/${currentVideo._id}`, {}, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      dispatch(like(currentUser._id));
    } catch (error) {
      console.error("Error liking video:", error);
      alert("Failed to like video. Please try again.");
    }
  };

  const handleDislike = async () => {
    if (!currentUser) {
      alert("Please log in to dislike videos!");
      return;
    }
    if (!currentVideo) return; // Ensure video is loaded

    try {
      await axios.put(`http://localhost:5000/api/users/dislike/${currentVideo._id}`, {}, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      dispatch(dislike(currentUser._id));
    } catch (error) {
      console.error("Error disliking video:", error);
      alert("Failed to dislike video. Please try again.");
    }
  };

  const handleSubscribe = async () => {
    if (!currentUser) {
      alert("Please log in to subscribe!");
      return;
    }
    if (!channel || !channel._id) {
      console.warn("Channel data not loaded for subscription.");
      return;
    }

    try {
      if (currentUser.subscribedUsers?.includes(channel._id)) {
        await axios.put(`http://localhost:5000/api/users/unsub/${channel._id}`, {}, { headers: { 'Authorization': `Bearer ${currentUser.token}` } });
      } else {
        await axios.put(`http://localhost:5000/api/users/sub/${channel._id}`, {}, { headers: { 'Authorization': `Bearer ${currentUser.token}` } });
      }
      dispatch(subscription(channel._id));
    } catch (error) {
      console.error("Error subscribing/unsubscribing:", error);
      alert("Subscription action failed. Please try again.");
    }
  };

  const formatNumber = (num) => {
    if (typeof num !== 'number') return '';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num;
  };

  // Render nothing or a loading state if currentVideo or channel data isn't available yet
  if (!currentVideo || !channel || !channel._id) {
    return <div className="flex justify-center items-center h-full text-white">Loading video and channel...</div>;
  }

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
      </div>

      <h1 className="text-xl font-bold mb-3 mt-4">
        {currentVideo?.title}
      </h1>

      <div className="flex justify-between md:items-center mb-2 flex-wrap gap-y-3 gap-x-6">
        <div className='flex align-center items-center gap-4'>
        <Link to={`/channel/${channel._id}`} className="flex items-center gap-3 cursor-pointer">
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
          <div className="flex flex-col">
            <span className="font-semibold text-base flex items-center gap-1">
              {channel?.channelName}
              {channel?.isVerified && <MdVerified className="text-blue-400 text-lg" title="Verified" />}
            </span>
            <span className="text-gray-400 text-sm">
              {formatNumber(channel?.subscribers)} subscribers
            </span>
          </div>
        </Link>

        <div className="ml-4 flex gap-2">
          {currentUser && currentUser._id !== channel._id ? (
            <button
              onClick={handleSubscribe}
              className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90"
            >
              {currentUser.subscribedUsers?.includes(channel._id) ? "Subscribed" : "Subscribe"}
            </button>
          ) : !currentUser && (
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90">
              Sign In to Subscribe
            </Link>
          )}
        </div>
        </div>

        <div className="flex items-center gap-3 text-gray-200 text-base">
          <div className="flex items-center bg-zinc-900 rounded-full overflow-hidden">
            <button onClick={handleLike} className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-800 cursor-pointer">
              {
                currentVideo?.likes?.includes(currentUser?._id) ? (
                  <BiSolidLike className='text-xl' />
                ) : (
                  <BiLike className='text-xl' />
                )
              } {" "}
              <span className="text-sm font-semibold">{formatNumber(currentVideo?.likes?.length)}</span>
            </button>
            <div className="h-6 w-[1px] bg-zinc-700"></div>
            <button onClick={handleDislike} className="flex items-center px-4 py-2 hover:bg-zinc-800 cursor-pointer">
              {
                currentVideo?.dislikes?.includes(currentUser?._id) ? (
                  <BiSolidDislike className='text-xl' />
                ) : (
                  <BiDislike className='text-xl' />
                )
              }
            </button>
          </div>
          <button className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full hover:bg-zinc-800 cursor-pointer">
            <AiOutlineShareAlt className="text-xl" />
            <span className="text-sm font-semibold">Share</span>
          </button>
          <button className="bg-zinc-900 hover:bg-zinc-800 p-2 rounded-full w-10 h-10 flex items-center justify-center">
            <BsThreeDots className="text-xl" />
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-lg p-4 mt-2 text-sm text-gray-200">
        <div className="flex items-center gap-3 mb-2 font-semibold">
          <span>{formatNumber(currentVideo?.views)} views</span>
          <span>{format(currentVideo?.createdAt)}</span>
        </div>
        <p className="whitespace-pre-line leading-relaxed">
          {currentVideo?.description?.split('\n')[0]}
          {currentVideo?.description?.split('\n').length > 1 && (
            <span className="text-blue-400 cursor-pointer"> ...more</span>
          )}
        </p>
      </div>

      <Comment videoId={currentVideo?._id} />
    </div>
  );
};

export default VideoPlayer;