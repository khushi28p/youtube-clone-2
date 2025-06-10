import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import {format} from 'timeago.js'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config';

const RecommendationSection = ({tags}) => {
  const [recommendedVideos, setRecommendedVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async() => {
      if (tags && tags.length > 0) { 
        try {
          const res = await axios.get(`${BASE_URL}/videos/tags?tags=${tags.join(',')}`); 
          setRecommendedVideos(res.data);
        } catch (error) {
          console.error("Error fetching recommended videos:", error);
        }
      } else {
          setRecommendedVideos([]); // Clear recommendations if no tags
      }
    }

    fetchVideos();
  }, [tags]);

  return (
    <div className="p-4 text-white"> 
      <div className="font-bold text-xl mb-4">Recommendations</div> 
      <div className="space-y-4"> 
        {recommendedVideos.map((video) => (
          <Link to={`/video/${video._id}`} key={video._id} className="block">
          <div className="flex gap-3 cursor-pointer"> 
            <div className="w-40 h-24 flex-shrink-0 relative rounded-lg overflow-hidden"> 
              <img 
                src={video.thumbnailUrl} 
                alt={video.title} 
                className="absolute top-0 left-0 w-full h-full object-cover" 
              />
            </div>
            
            {/* Video Details */}
            <div className="flex flex-col flex-grow"> 
              <div className="font-semibold text-sm line-clamp-2"> 
                {video.title}
              </div>
              <div className="text-gray-400 text-xs mt-1"> 
                {video.userId.channelName}
              </div>
              <div className="text-gray-400 text-xs">
                {video.views} views • {format(video.createdAt)}
              </div>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RecommendationSection
