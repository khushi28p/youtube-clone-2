import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { subscription } from '../redux/userSlice';

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
                const channelRes = await axios.get(`http://localhost:5000/api/users/find/${id}`);

                setChannel(channelRes.data);

                const videoRes = await axios.get(`http://localhost:5000/api/videos/find/${id}`);

                setVideos(Array.isArray(videoRes.data) ? videoRes.data : []);
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
        await axios.put(`http://localhost:5000/api/users/unsub/${channel._id}`, {}, {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        setChannel(prev => ({ ...prev, subscribers: prev.subscribers - 1 }));
        dispatch(subscription(channel._id));
      } else {
        await axios.put(`http://localhost:5000/api/users/sub/${channel._id}`, {}, {
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
    <div className="bg-bg-dark min-h-[calc(100vh-4rem)] p-4 text-white">
      {/* Banner Image */}
      {channel.bannerImage && (
        <div className="w-full h-48 md:h-64 lg:h-80 bg-cover bg-center rounded-lg overflow-hidden mb-6"
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
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mr-0 md:mr-6 mb-4 md:mb-0 border-2 border-zinc-600"
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
            {channel.subscribers} subscribers
          </p>
          <p className="text-zinc-300 text-sm max-w-2xl mb-4">
            {channel.description || 'No description provided.'}
          </p>
          {!isOwnChannel && currentUser && ( 
            <button
              onClick={handleSubscribe}
              className={`py-2 px-6 rounded-full font-semibold text-sm transition-colors duration-200
                ${isSubscribed ? 'bg-zinc-700 text-white hover:bg-zinc-600' : 'bg-red-600 text-white hover:bg-red-700'}
              `}
            >
              {isSubscribed ? 'SUBSCRIBED' : 'SUBSCRIBE'}
            </button>
          )}
          {!currentUser && ( 
             <Link to="/login" className="py-2 px-6 rounded-full font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700">
               Sign In to Subscribe
             </Link>
          )}
        </div>
      </div>

      {/* Videos Section */}
      <h2 className="text-2xl font-bold mb-4">Videos</h2>
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {videos.map((video) => (
            <Link to={`/video/${video._id}`} key={video._id} className="block group">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-36 object-cover rounded-lg mb-2 transform group-hover:scale-105 transition-transform duration-200"
              />
              <h3 className="text-md font-semibold truncate">{video.title}</h3>
              <p className="text-zinc-400 text-sm">{channel.channelName}</p>
              {/* You might want to add views/timestamps here too */}
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
