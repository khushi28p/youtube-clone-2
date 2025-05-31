import React, { useEffect, useState } from 'react'
import { UserIcon } from '@heroicons/react/24/outline';
import { format } from 'timeago.js';
import axios from 'axios';

const VideoCard = ({video}) => {
  const { title, thumbnailUrl, videoUrl, views, createdAt, userId } = video;

  const formatViews = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M views';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K views';
    return num + ' views';
  };

  const name = userId.channelName;
  const avatar = userId.profilePicture; // Default placeholder

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
        {avatar ? (
          // If channelAvatarUrl exists, display an image
          <img src={avatar} alt={name} className="h-9 w-9 rounded-full flex-shrink-0 mt-1 object-cover" />
        ) : (
          <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 mt-1">
            <UserIcon className="h-6 w-6" /> 
          </div>
        )}

        {/* Text Details */}
        <div className="flex flex-col flex-grow">
          <h3 className="text-white text-md font-semibold line-clamp-2 leading-tight mb-1">
            {title}
          </h3>
          <p className="text-gray-400 text-sm">{name}</p>
          <p className="text-gray-400 text-sm">
            {formatViews(views)} • {format(createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoCard
