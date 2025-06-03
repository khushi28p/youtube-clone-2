import React from 'react'
import VideoPlayer from '../components/VideoPlayer'
import Header from '../components/Header'
import RecommendationSection from '../components/RecommendationSection'

const VideoPlayerSection = () => {
  return (
    <div className="flex flex-col h-screen text-white "> 
      <Header />
      <div className="flex flex-col lg:flex-row flex-grow p-4 gap-4 overflow-auto px-16 mt-16">
        <div className="lg:w-2/3 w-full"> 
            <VideoPlayer/>
        </div>
        <div className="lg:w-1/3 w-full min-w-[280px]"> 
            <RecommendationSection/>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayerSection
