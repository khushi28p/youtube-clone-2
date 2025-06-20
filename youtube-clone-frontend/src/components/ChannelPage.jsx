import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { subscription } from '../redux/userSlice';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';
import { BASE_URL } from '../config';

const ChannelPage = () => {
    const {id} = useParams();
    const {currentUser} = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchChannelData = async() => {
            setLoading(true);
            setError(null);

            try{
                const channelRes = await axios.get(`${BASE_URL}/users/find/${id}`);

                setChannel(channelRes.data);

                const videoRes = await axios.get(`${BASE_URL}/videos/channel/${id}`);

                setVideos(videoRes.data);
            }
            catch(error){
                console.error("Error fetching channel data:", error);
                setError("Failed to load channel. Please try again.");
                setVideos([]);
            } 
            finally{
                setLoading(false);
            }
        }

        fetchChannelData();
    }, [id]);

    if (loading) {
    return <div className="text-white text-center mt-8">Loading channel...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  if (!channel) {
    return <div className="text-white text-center mt-8">Channel not found.</div>;
  }


  const isSubscribed = currentUser && currentUser.subscribedUsers?.includes(channel._id);
  const isOwnChannel = currentUser && currentUser._id === channel._id;

  const handleSubscribe = async () => {
    try {
      if (isSubscribed) {
        await axios.put(`${BASE_URL}/users/unsub/${channel._id}`, {}, {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        setChannel(prev => ({ ...prev, subscribers: prev.subscribers - 1 }));
        dispatch(subscription(channel._id));
      } else {
        await axios.put(`${BASE_URL}/users/sub/${channel._id}`, {}, {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        setChannel(prev => ({ ...prev, subscribers: prev.subscribers + 1 }));
        dispatch(subscription(channel._id));
      }
    } catch (err) {
      console.error("Subscription failed:", err);
      alert("Subscription action failed. Please try again.");
    }
  };

  return (
    <div className="bg-bg-dark min-h-[calc(100vh-4rem)] px-16 text-white">
      {/* Banner Image */}
      {channel.bannerImage && (
        <div className="w-full h-48 bg-cover bg-center rounded-lg overflow-hidden mb-6"
             style={{ backgroundImage: `url(${channel.bannerImage})` }}>
        </div>
      )}

      {/* Channel Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start mb-8 border-b border-zinc-700 pb-6">
        {/* Profile Picture */}
        {channel.profilePicture ? (
          <img
            src={channel.profilePicture}
            alt={channel.channelName}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mr-0 md:mr-6 mb-4 md:mb-0"
          />
        ) : (
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-zinc-700 flex items-center justify-center text-4xl mr-0 md:mr-6 mb-4 md:mb-0 border-2 border-zinc-600">
            {channel.channelName?.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Channel Info and Subscribe Button */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">{channel.channelName}</h1>
          <p className="text-zinc-400 text-sm mb-2">
            {channel.subscribers} subscribers • {videos.length} videos
          </p>
          <p className="text-zinc-300 text-sm max-w-2xl mb-4">
            {channel.description || 'No description provided.'}
          </p>
          {isOwnChannel ? (
                        // Options for YOUR OWN Channel
                        <div className="flex gap-4 justify-center md:justify-start">
                            <Link to="/edit-channel" className="py-2 px-6 rounded-full font-semibold text-sm bg-zinc-700 text-white hover:bg-zinc-600">
                                Customize Channel
                            </Link>
                            <Link to="/manage-videos" className="py-2 px-6 rounded-full font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700">
                                Manage Videos
                            </Link>
                        </div>
                    ) : (
                        <>
                            {currentUser ? ( 
                                <button
                                    onClick={handleSubscribe}
                                    className={`py-2 px-6 rounded-full font-semibold text-sm transition-colors duration-200
                                        ${isSubscribed ? 'bg-zinc-700 text-white hover:bg-zinc-600' : 'bg-red-600 text-white hover:bg-red-700'}
                                    `}
                                >
                                    {isSubscribed ? 'SUBSCRIBED' : 'SUBSCRIBE'}
                                </button>
                            ) : (
                                <Link to="/login" className="py-2 px-6 rounded-full font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700">
                                    Sign In to Subscribe
                                </Link>
                            )}
                        </>
                    )}
        </div>
      </div>

      {/* Videos Section */}
      <h2 className="text-2xl font-bold mb-4">Videos</h2>
      {videos.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
          {videos.map((video) => (
            <Link to={`/video/${video._id}`} key={video._id} className="block group">
              <div className="w-full aspect-video overflow-hidden rounded-lg mb-2">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover rounded-lg mb-2 transform group-hover:scale-105 transition-transform duration-200"
              />
              </div>
              <h3 className="text-md font-semibold truncate">{video.title}</h3>
              <p className="text-zinc-400 text-xs">{video.views} views • {format(video.createdAt)}</p>
            
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-zinc-400">No videos uploaded by this channel yet.</p>
      )}
    </div>
  )
}

export default ChannelPage
