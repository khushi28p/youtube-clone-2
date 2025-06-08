import React, { useMemo, useEffect } from 'react'; // Added useMemo for performance
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
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchSubscribedChannelsSuccess } from '../redux/userSlice';

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

const Sidebar = ({isOpen}) => {
  const { currentUser, subscribedChannels } = useSelector((state) => state.user || {});

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (currentUser) {
        try {
          const res = await axios.get('http://localhost:5000/api/users/subscribedChannels', {
            headers: {  
              Authorization: `Bearer ${currentUser.token}`, 
            },
          });
          dispatch(fetchSubscribedChannelsSuccess(res.data)); 
        } catch (err) {
          console.error('Failed to fetch subscribed channels:', err);
        }
      } else {
        dispatch(fetchSubscribedChannelsSuccess([])); 
      }
    };

    fetchSubscriptions();
  }, [currentUser, dispatch]);

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
    <aside className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] bg-bg-dark z-10 
        p-4 pt-4 overflow-y-auto scrollbar-hide 
        transition-transform duration-300 ease-in-out
        w-60      
        md:w-60           
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${!isOpen && 'md:w-20 md:p-2'} 
        
      `}>
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
            {subscribedChannels.map((channel) => (
              <Link
                to={`/channel/${channel._id}`} 
                key={channel._id}
                className="flex items-center p-2 rounded-lg hover:bg-zinc-800 cursor-pointer mb-1"
              >
                {channel.profilePicture ? ( 
                  <img
                    src={channel.profilePicture}
                    alt={channel.channelName} 
                    className="h-6 w-6 rounded-full mr-4 object-cover"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-white mr-4">
                    {channel.channelName ? channel.channelName.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
                <span className="text-white text-sm truncate">{channel.channelName}</span>
              </Link>
            ))}
            {subscribedChannels.length === 0 && (
              <p className="text-zinc-400 text-sm p-2">No subscriptions yet.</p>
            )}
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