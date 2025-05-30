import React from 'react'

const VideoCard = ({video}) => {
  const {  _id, title, thumbnailUrl, videoUrl, views, createdAt, user } = video;

  const formatViews = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M views';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K views';
    return num + ' views';
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const months = Math.round(days / 30.4);
    const years = Math.round(days / 365);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 30) return `${days} days ago`;
    if (months < 12) return `${months} months ago`;
    return `${years} years ago`;
  };

  const channelName = user ? user.name : 'Unknown Channel';
  const channelAvatar = user ? user.avatar : 'https://via.placeholder.com/48/0000FF/FFFFFF?text=?'; // Default placeholder

  const duration = "10:30";

  return (
    <div className="flex flex-col cursor-pointer">
      {/* Thumbnail */}
      <div className="relative mb-2 w-full aspect-video rounded-lg overflow-hidden">
        <img src={thumbnailUrl} alt={title} className="rounded-lg w-full h-full object-cover" />
        {duration && (
          <span className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 py-0.5 rounded">
            {duration}
          </span>
        )}
      </div>

      {/* Video Details */}
      <div className="flex space-x-3">
        {/* Channel Avatar */}
        <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0 mt-1">
          {channelAvatar}
        </div>
        {/* Text Details */}
        <div className="flex flex-col flex-grow">
          <h3 className="text-white text-md font-semibold line-clamp-2 leading-tight mb-1">
            {title}
          </h3>
          <p className="text-gray-400 text-sm">{channelName}</p>
          <p className="text-gray-400 text-sm">
            {views} • {timeAgo(createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoCard
