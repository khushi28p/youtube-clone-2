import React, { useMemo } from 'react'; // Added useMemo for performance
import {
  HomeIcon,
  PlayIcon,
  ListBulletIcon,
  ClockIcon,
  FolderIcon,
  HandThumbUpIcon,
  PhotoIcon,
  QueueListIcon,
  UserCircleIcon,
  VideoCameraIcon, 
} from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/solid';
import {
  ShoppingBagIcon,
  MusicalNoteIcon,
  FilmIcon,
  SignalIcon,
  HeartIcon,
  NewspaperIcon,
  TrophyIcon,
  AcademicCapIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { NavLink, Link } from 'react-router-dom'; 
import { useSelector } from 'react-redux';

const SidebarItem = ({ icon: Icon, name, path }) => {
  const content = (
    <>
      <Icon className="h-6 w-6 text-white mr-4" />
      <span className="text-white text-sm">{name}</span>
    </>
  );

  return path ? (
    <NavLink
      to={path}

      className={({ isActive }) =>
        `flex items-center p-2 rounded-lg cursor-pointer mb-1 ${
          isActive ? 'bg-zinc-800/70' : 'hover:bg-zinc-800/70'
        }`
      }
    >
      {content}
    </NavLink>
  ) : (
    <div className="flex items-center p-2 rounded-lg hover:bg-zinc-800 cursor-pointer mb-1">
      {content}
    </div>
  );
};

const Sidebar = () => {
  const { currentUser } = useSelector((state) => state.user);

  const primaryNavItems = useMemo(
    () => [
      { icon: HomeIcon, name: 'Home', path: '/' },
      { icon: FireIcon, name: 'Trending', path: '/trending' },
      { icon: ListBulletIcon, name: 'Subscriptions', path: '/subscription' },
    ],
    []
  );

  const youSectionItems = useMemo(
    () => [
      { icon: ClockIcon, name: 'History', path: '/history' }, 
      { icon: FolderIcon, name: 'Playlists', path: '/playlists' },
      { icon: VideoCameraIcon, name: 'Your videos', path: '/your-videos' }, 
      { icon: ClockIcon, name: 'Watch later', path: '/watch-later' },
      { icon: HandThumbUpIcon, name: 'Liked videos', path: '/liked-videos' },
    ],
    []
  );

  const subscriptions = useMemo(
    () => [
      { name: 'User1', avatar: 'U1' },
      { name: 'User 2', avatar: 'U' },
      { name: 'ABC', avatar: 'A' },
      { name: 'xyz', avatar: 'X' },
      { name: 'hello', avatar: 'H' },
      { name: 'Hii', avatar: 'HI' },
    ],
    []
  );

  const exploreItems = useMemo(
    () => [
      { icon: FireIcon, name: 'Trending' },
      { icon: ShoppingBagIcon, name: 'Shopping' },
      { icon: MusicalNoteIcon, name: 'Music' },
      { icon: FilmIcon, name: 'Movies' },
      { icon: SignalIcon, name: 'Live' },
      { icon: HeartIcon, name: 'Gaming' },
      { icon: NewspaperIcon, name: 'News' },
      { icon: TrophyIcon, name: 'Sports' },
      { icon: AcademicCapIcon, name: 'Courses' },
      { icon: QueueListIcon, name: 'Fashion & Beauty' },
      { icon: AdjustmentsHorizontalIcon, name: 'Podcasts' },
    ],
    []
  );

  return (
    <aside className="w-60 bg-black p-4 pt-20 fixed top-0 left-0 h-screen overflow-y-auto scrollbar-hide">
      <nav className="mb-2">
        {primaryNavItems.map((item) => (
          <SidebarItem key={item.name} {...item} /> 
        ))}
      </nav>

      <hr className="border-zinc-800 mb-4" />

      {/* You Section */}
      <h3 className="text-white text-md font-semibold mb-2">You</h3>
      <nav className="mb-2">
        {youSectionItems.map((item) => (
          <SidebarItem key={item.name} {...item} /> 
        ))}
      </nav>

      <hr className="border-zinc-800 mb-4" />

      {/* Subscriptions */}
      {currentUser ? (
        <div>
          <h3 className="text-white text-md font-semibold mb-2">Subscriptions</h3>
          <nav>
            {subscriptions.map((sub) => (
              <div
                key={sub.name} 
                className="flex items-center p-2 rounded-lg hover:bg-zinc-800 cursor-pointer mb-1"
              >
                <div className="h-6 w-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-white mr-4">
                  {sub.avatar}
                </div>
                <span className="text-white text-sm truncate">{sub.name}</span>
              </div>
            ))}
          </nav>
        </div>
      ) : (
        <Link to="/login" className="flex flex-col gap-4 mb-2 p-2"> 
          <div className="text-sm px-2 text-center">
            Sign in to like videos, comment, and subscribe.
          </div>
          <button className="flex items-center justify-center gap-2 text-blue-600 text-sm font-semibold border border-zinc-500 px-4 py-1 rounded-full self-center">
            <UserCircleIcon className="h-6" />
            Sign in
          </button>
        </Link>
      )}

      <hr className="border-zinc-800 mb-4" />

      {/* Explore section */}
      <h3 className="text-white text-md font-semibold mb-2">Explore</h3>
      <nav className="mb-2">
        {exploreItems.map((item) => (
          <SidebarItem key={item.name} {...item} />
        ))}
      </nav>

      <hr className="border-zinc-800 mb-4" />
    </aside>
  );
};

export default Sidebar;