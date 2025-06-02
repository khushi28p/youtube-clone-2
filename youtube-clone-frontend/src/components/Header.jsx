import React from 'react'
import {  MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline'; // Example icons
import { Bars3Icon } from '@heroicons/react/24/solid';

const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 h-16 bg-black fixed top-0 w-full z-20">
      
      <div className="flex items-center space-x-4">
        <Bars3Icon className="h-6 w-6 cursor-pointer text-gray-300 hover:text-white" />
        <div className="flex items-center space-x-1 cursor-pointer">
          <img src="/youtube_logo.png" alt="YouTube Logo" className='h-12' /> 
          <span className="text-white font-bold text-xl">YouTube<sup className='font-normal text-xs text-gray-400'>IN</sup></span>
        </div>
      </div>

      <div className="flex items-center flex-1 mx-8 max-w-xl">
        <input
          type="text"
          placeholder="Search"
          className="flex-1 px-4 py-2 rounded-l-full bg-[#121212] border border-zinc-700 focus:outline-none focus:border-blue-500 text-gray-300 placeholder-gray-500"
        />
        <button className="p-2 rounded-r-full bg-[#222222] border border-zinc-700 border-l-0">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-300" />
        </button>
      </div>

      { <div className="flex items-center space-x-6">
        <BellIcon className="h-6 w-6 text-white cursor-pointer" />
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold cursor-pointer">
          U
        </div>
      </div>}
    </header>
  )
}

export default Header
