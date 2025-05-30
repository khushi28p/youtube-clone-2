import React from 'react'

const VideoCard = ({video}) => {
  const { thumbnail, title, channel, views, time, duration, avatar } = video;

  return (
    <div className="flex flex-col cursor-pointer">
      {/* Thumbnail */}
      <div className="relative mb-2 w-full aspect-video rounded-lg overflow-hidden">
        <img src={thumbnail} alt={title} className="rounded-lg w-full h-full object-cover" />
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
          {avatar}
        </div>
        {/* Text Details */}
        <div className="flex flex-col flex-grow">
          <h3 className="text-white text-md font-semibold line-clamp-2 leading-tight mb-1">
            {title}
          </h3>
          <p className="text-gray-400 text-sm">{channel}</p>
          <p className="text-gray-400 text-sm">
            {views} • {time}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoCard
