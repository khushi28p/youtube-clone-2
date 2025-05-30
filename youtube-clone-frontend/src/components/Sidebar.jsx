import React from 'react'
import { HomeIcon, PlayIcon, ListBulletIcon, ClockIcon, FolderIcon, HandThumbUpIcon, PhotoIcon, QueueListIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/solid'; 
import { ShoppingBagIcon, MusicalNoteIcon, FilmIcon, SignalIcon, HeartIcon, NewspaperIcon, TrophyIcon, AcademicCapIcon, AdjustmentsHorizontalIcon} from '@heroicons/react/24/outline'

const Sidebar = () => {
  const primaryNavItems = [
    { icon: HomeIcon, name: 'Home' },
    { icon: FireIcon, name: 'Shorts' }, // Using FireIcon as an example for Shorts
    { icon: ListBulletIcon, name: 'Subscriptions' },
  ];

  const youSectionItems = [
    { icon: ClockIcon, name: 'History' },
    { icon: FolderIcon, name: 'Playlists' },
    { icon: PlayIcon, name: 'Your videos' }, // Assuming VideoCameraIcon from Header can be reused
    { icon: ClockIcon, name: 'Watch later' },
    { icon: HandThumbUpIcon, name: 'Liked videos' },
  ];

  const subscriptions = [
    { name: 'User1', avatar: 'U1' },
    { name: 'User 2', avatar: 'U' },
    { name: 'ABC', avatar: 'A' },
    { name: 'xyz', avatar: 'X' },
    { name: 'hello', avatar: 'H' },
    { name: 'Hii', avatar: 'HI' },
  ];

  const exploreItems = [
    {icon: FireIcon,name:"Trending"},
    {icon: ShoppingBagIcon,name: "Shopping"},
    {icon: MusicalNoteIcon,name:"Music"},
    {icon: FilmIcon,name: "Movies"},
    {icon: SignalIcon,name:"Live"},
    {icon: HeartIcon,name: "Gaming"},
    {icon: NewspaperIcon,name:"News"},
    {icon: TrophyIcon,name: "Sports"},
    {icon: AcademicCapIcon,name:"Courses"},
    {icon: QueueListIcon,name: "Fashion & Beauty"},
    {icon: AdjustmentsHorizontalIcon,name: "Podcasts"}
  ]

  return (
    <aside className="w-60 bg-black p-4 pt-20 fixed top-0 left-0 h-screen overflow-y-auto scrollbar-hide">
      <nav className="mb-6">
        {primaryNavItems.map((item, index) => (
          <div key={index} className="flex items-center p-2 rounded-lg hover:bg-zinc-800 cursor-pointer mb-1">
            <item.icon className="h-6 w-6 text-white mr-4" />
            <span className="text-white text-sm">{item.name}</span>
          </div>
        ))}
      </nav>

      <hr className="border-zinc-800 mb-6" />

      {/* You Section */}
      <h3 className="text-white text-md font-semibold mb-2">You <span className="ml-2 bg-zinc-800 px-2 py-0.5 rounded-full text-white text-xs"> </span></h3>
      <nav className="mb-6">
        {youSectionItems.map((item, index) => (
          <div key={index} className="flex items-center p-2 rounded-lg hover:bg-zinc-800 cursor-pointer mb-1">
            <item.icon className="h-6 w-6 text-white mr-4" />
            <span className="text-white text-sm">{item.name}</span>
          </div>
        ))}
      </nav>

      <hr className="border-zinc-800 mb-6" />

      {/* Subscriptions */}
      <h3 className="text-white text-md font-semibold mb-2">Subscriptions</h3>
      <nav>
        {subscriptions.map((sub, index) => (
          <div key={index} className="flex items-center p-2 rounded-lg hover:bg-zinc-800 cursor-pointer mb-1">
            <div className="h-6 w-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-white mr-4">
              {sub.avatar}
            </div>
            <span className="text-white text-sm truncate">{sub.name}</span>
          </div>
        ))}
      </nav>

      <hr className="border-zinc-800 mb-6" />

      {/* Explore section */}
      <h3 className="text-white text-md font-semibold mb-2">Explore</h3>
      <nav className="mb-6">
        {exploreItems.map((item, index) => (
          <div key={index} className="flex items-center p-2 rounded-lg hover:bg-zinc-800 cursor-pointer mb-1">
            <item.icon className="h-6 w-6 text-white mr-4" />
            <span className="text-white text-sm">{item.name}</span>
          </div>
        ))}
      </nav>

      <hr className="border-zinc-800 mb-6" />
    </aside>
  );
}

export default Sidebar
