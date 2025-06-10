import React, { useState, useEffect } from 'react'
import VideoCard from './VideoCard';
import axios from 'axios';
import { useSelector } from 'react-redux';

const MainContent = ({type}) => {
  const {currentUser} = useSelector((state) => state.user);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async() => {
      const token = currentUser.token;
      const res = await axios.get(`http://localhost:5000/api/videos/${type}`, {headers: {
            Authorization: `Bearer ${token}`, 
          }});
      setVideos(res.data);
    }

    fetchVideos();
  }, [type]);

  const categories = [
    'All', 'Music', 'Source code', 'Podcasts', 'Computer programming',
    'Shark Tank', 'Study skills', 'Live', 'Disha Vakani', 'Web series', 'Frequencies', 'Mantras'
  ];

  return (
    <main className="flex-1 overflow-y-auto bg-black"> 
      {/* Categories/Filters */}
      <div className="flex items-center space-x-3 mb-6 overflow-x-auto scrollbar-hide sticky top-0 z-10 bg-black pb-2 -mx-8 px-8 pt-2">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm
              ${category === 'All' ? 'bg-white text-black' : 'bg-zinc-700 text-white hover:bg-zinc-600'}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-4 gap-y-8">
        {videos.map((video, index ) => (
          <VideoCard key={video._id || index} video={video} />
        ))}
      </div>
    </main>
  );
}

export default MainContent
