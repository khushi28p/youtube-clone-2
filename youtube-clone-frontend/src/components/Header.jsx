import React, { useState } from 'react'
import {  MagnifyingGlassIcon, BellIcon, UserCircleIcon, EllipsisVerticalIcon, VideoCameraIcon } from '@heroicons/react/24/outline'; // Example icons
import { Bars3Icon } from '@heroicons/react/24/solid';
import { Link, useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import UploadVideoForm from './UploadVideoForm';
import { logout } from '../redux/userSlice';

const Header = () => {
  const {currentUser} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) =>{
    e.preventDefault();

    if(searchQuery.trim()){
      navigate(`/search?q=${searchQuery.trim()}`);
    }
  }

  const openUploadModal = () => {
    if (currentUser) {
      setIsUploadModalOpen(true);
    } else {
      alert("Please sign in to upload a video.");
      navigate("/login"); 
    }
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  }

  const handleSignOut = () => {
    dispatch(logout());

    localStorage.removeItem("currentUser");

    navigate("/login");
    setShowDropdown(false);

    window.location.reload();
  }

  const getEmailPrefix = (email) => {
    if (!email) return ''; 
    const atIndex = email.indexOf('@');
    return atIndex !== -1 ? email.substring(0, atIndex) : email;
  };

  return (
    <>
    <header className="flex items-center justify-between px-4 h-16 bg-black fixed top-0 w-full z-20">
      
      <div className="flex items-center space-x-4">
        <Bars3Icon className="h-6 w-6 cursor-pointer text-gray-300 hover:text-white" />
        <div className="flex items-center space-x-1 cursor-pointer">
          <img src="/youtube_logo.png" alt="YouTube Logo" className='h-12' /> 
          <span className="text-white font-bold text-xl">YouTube<sup className='font-normal text-xs text-gray-400'>IN</sup></span>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex items-center flex-1 mx-8 max-w-xl">
        <input
          type="text"
          placeholder="Search"
          className="flex-1 px-4 py-2 rounded-l-full bg-[#121212] border border-zinc-700 focus:outline-none focus:border-blue-500 text-gray-300 placeholder-gray-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="p-2 rounded-r-full bg-[#222222] border border-zinc-700 border-l-0">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-300" />
        </button>
      </form>

      { currentUser ? (
        <div className='flex items-center gap-6'>
          <BellIcon className="h-6 w-6 text-white cursor-pointer" />
          <VideoCameraIcon
              className="h-6 w-6 text-white cursor-pointer"
              onClick={openUploadModal}
            />
          {currentUser.profilePicture ? (
              <img
                src={currentUser.profilePicture}
                alt={currentUser.channelName}
                className='h-10 w-10 rounded-full object-cover cursor-pointer'
                onClick={handleProfileClick} 
              />
            ) : (
              <div
                className='h-10 w-10 rounded-full bg-zinc-700 flex items-center justify-center text-xl font-bold cursor-pointer'
                onClick={handleProfileClick}
              >
                {currentUser.channelName?.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute top-14 right-0 bg-[#282828] rounded-lg shadow-xl w-60 z-30 overflow-hidden">
                <div className="flex items-center p-4 border-b border-zinc-700">
                  {currentUser.profilePicture ? (
                    <img src={currentUser.profilePicture} alt="Profile" className='h-10 w-10 rounded-full object-cover mr-3' />
                  ) : (
                    <div className='h-10 w-10 rounded-full bg-zinc-600 flex items-center justify-center text-xl font-bold mr-3'>
                      {currentUser.channelName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-semibold text-sm">{currentUser.channelName}</p>
                    <p className="text-zinc-400 text-xs">{getEmailPrefix(currentUser.email)}</p>
                  </div>
                </div>
                <Link
                  to={`/channel/${currentUser._id}`}
                  className="block px-4 py-2 text-white hover:bg-zinc-700"
                  onClick={() => setShowDropdown(false)} 
                >
                  View your channel
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-white hover:bg-zinc-700"
                  onClick={() => setShowDropdown(false)}  
                >
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-white hover:bg-zinc-700"
                >
                  Sign out
                </button>
              </div>
            )}
      </div>
    ) :(
    <div className="flex items-center space-x-6">
        <EllipsisVerticalIcon className="h-6 w-6 text-white cursor-pointer" />
        <Link to="/login"> 
          <button className="flex items-center justify-center gap-2 text-sm font-semibold border border-zinc-500 px-4 py-1 rounded-full self-center">
            <UserCircleIcon className="h-6" />
            Sign in
          </button>
        </Link>
      </div>
    )}
    </header>

    {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative bg-[#0f0f0f] p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-zinc-700">
            {/* Close button for the modal */}
            <button
              onClick={closeUploadModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold"
            >
              &times; {/* This is an 'x' character */}
            </button>
            <UploadVideoForm onClose={closeUploadModal} /> {/* Pass close function as a prop */}
          </div>
        </div>
      )}
      </>
  )
}

export default Header
