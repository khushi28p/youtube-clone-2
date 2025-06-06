import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';

const Search = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async() => {
      try{
        const query = new URLSearchParams(location.search).get('q');
        if(query){
          const res = await axios.get(`http://localhost:5000/api/videos/search?q=${query}`);
          setSearchResults(res.data);
        } else{
          setSearchResults([]);
        }
      } catch(error){
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [location.search]);

  return (
    <div className='flex flex-col text-white min-h-[calc(100vh-64px)] bg-black'>
      <h1 className="font-bold text-2xl md:text-3xl mb-6 border-b border-zinc-800 pb-4">
        Search Results for "{new URLSearchParams(location.search).get('q')}"
        </h1> 
      <div className="flex flex-col gap-6"> 
        {searchResults.map((video) => (
          <Link to={`/video/${video._id}`} key={video._id} className="flex flex-col md:flex-row gap-4 items-start md:items-center hover:bg-zinc-900 rounded-lg p-3 transition-colors duration-200">
          
            <div className="w-full md:w-80 h-48 md:h-36 flex-shrink-0 relative rounded-lg overflow-hidden"> 
              <img 
                src={video.thumbnailUrl} 
                alt={video.title} 
                className="absolute top-0 left-0 w-full h-full object-cover" 
              />
            </div>
            
            {/* Video Details */}
            <div className="flex flex-col flex-grow w-2/3"> 
              <h2 className="font-semibold text-xl line-clamp-2 mb-1"> 
                {video.title}
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                {video.views} views • {format(video.createdAt)}
              </p>
              <div className="text-gray-400 text-sm mb-1 flex align-center items-center gap-2"> 
                <img 
                src={video.userId.profilePicture} 
                alt={video.userId.channelName} 
                className='w-h-6 rounded-full'
              />
                {video.userId.channelName}
              </div>
              <div className='text-gray-400 text-sm line-clamp-3'>
                {video.description}
              </div>
              
            </div>
          
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Search
