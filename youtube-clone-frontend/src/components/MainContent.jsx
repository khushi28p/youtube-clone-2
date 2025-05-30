import React from 'react'
import VideoCard from './VideoCard';

const MainContent = () => {
  const categories = [
    'All', 'Music', 'Source code', 'Podcasts', 'Computer programming',
    'Shark Tank', 'Study skills', 'Live', 'Disha Vakani', 'Web series', 'Frequencies', 'Mantras'
  ];

  const videos = [
    {
      thumbnail: '/youtube_logo.png',
      title: 'Say goodbye to blank-page scares and jump-start ideas faster',
      channel: 'Grammarly',
      views: 'Sponsored',
      time: 'Watch', // Special case for sponsored
      duration: 'Download', // Special case for sponsored
      avatar: 'G',
    },
    {
      thumbnail: '/youtube_logo.png',
      title: 'Build and Deploy a Full Stack MERN Social Media App with Auth, Pagination, Comment...',
      channel: 'Javascript Mastery',
      views: '533K views',
      time: '3 years ago',
      duration: '7:28:29',
      avatar: 'JM',
    },
    {
      thumbnail: '/youtube_logo.png',
      title: 'Medical Dreams - E02 - Ratta Kaise Maare? | Sharmnen Joshi | A Girlyapa Original Series',
      channel: 'Girlyapa',
      views: '2.8M views',
      time: '3 months ago',
      duration: '34:32',
      avatar: 'G',
    },
    {
      thumbnail: '/youtube_logo.png',
      title: 'YOU WILL NOT BE SAME',
      channel: 'Channel Name 4',
      views: '1.2M views',
      time: '6 months ago',
      duration: '12:06',
      avatar: 'C4',
    },
    {
      thumbnail: '/youtube_logo.png',
      title: 'Another interesting video title here',
      channel: 'Creator Name 5',
      views: '99K views',
      time: '1 month ago',
      duration: '8:45',
      avatar: 'C5',
    },
    {
      thumbnail: '/youtube_logo.png',
      title: 'How to learn React in 2024',
      channel: 'Coding Tutorials',
      views: '500K views',
      time: '2 weeks ago',
      duration: '15:30',
      avatar: 'CT',
    },
  ];

  return (
    <main className="flex-1 p-6 ml-60 overflow-y-auto bg-black"> 
      {/* Categories/Filters */}
      <div className="flex items-center space-x-3 mb-6 overflow-x-auto scrollbar-hide sticky top-0 z-10 bg-black pb-2 -mx-8 px-8">
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
        {videos.map((video, index) => (
          <VideoCard key={index} video={video} />
        ))}
      </div>
    </main>
  );
}

export default MainContent
