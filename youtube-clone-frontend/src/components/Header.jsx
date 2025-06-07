import React, { useState } from 'react'
import {  MagnifyingGlassIcon, BellIcon, UserCircleIcon, EllipsisVerticalIcon, VideoCameraIcon } from '@heroicons/react/24/outline'; // Example icons
import { Bars3Icon } from '@heroicons/react/24/solid';
import { Link, useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux';
import UploadVideoForm from './UploadVideoForm';

const Header = () => {
  const {currentUser} = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) =>{
    e.preventDefault();

    if(searchQuery.trim()){
      navigate(`/search?q=${searchQuery.trim()}`);
    }
  }

  const openUploadModal = () => {
    // Only open if a user is logged in
    if (currentUser) {
      setIsUploadModalOpen(true);
    } else {
      // Redirect to login or show a message if not logged in
      alert("Please sign in to upload a video.");
      navigate("/login"); 
    }
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
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
          <Link>
            <button>
              <img src={currentUser.profilePicture} alt={currentUser.channelName} className='h-10 rounded-full' />
            </button>
          </Link>
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
