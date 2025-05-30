import React from 'react'
import Header from '../components/Header.jsx'
import Sidebar from '../components/Sidebar.jsx' 
import MainContent from '../components/MainContent.jsx'

const YoutubeLayout = () => {
  return (
    <div className="flex flex-col h-screen text-white "> 
      <Header />
      <div className="flex flex-1 overflow-hidden pt-14"> 
        <Sidebar />
        <MainContent />
      </div>
    </div>
  )
}

export default YoutubeLayout
