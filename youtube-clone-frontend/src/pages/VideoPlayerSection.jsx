import React, { useEffect } from 'react'
import VideoPlayer from '../components/VideoPlayer'
import Header from '../components/Header'
import RecommendationSection from '../components/RecommendationSection'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { fetchSuccess } from '../redux/videoSlice'

const VideoPlayerSection = () => {
  const {currentVideo} = useSelector((state) => state.video);
  const videoId = useLocation().pathname.split("/")[2];
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVideo = async() => {
      try{
        const videoRes = await axios.get(`http://localhost:5000/api/videos/find/${videoId}`);
        dispatch(fetchSuccess(videoRes.data)); 
      }catch (error) {
        console.error("Error fetching video data:", error);
      }
    }

    fetchVideo();
  }, [videoId, dispatch])
  return (
      <div className="flex flex-col lg:flex-row flex-grow min-h-0 overflow-auto"> 
      
        <div className="lg:w-2/3 w-full"> 
            {videoId && <VideoPlayer videoId={videoId} />}
        </div>
        <div className="lg:w-1/3 w-full min-w-[280px]"> 
            <RecommendationSection tags={currentVideo.tags}/>
        </div>
        </div>
  )
}

export default VideoPlayerSection
