import React, {useState, useEffect  } from 'react'
import Header from '../components/Header.jsx'
import Sidebar from '../components/Sidebar.jsx' 
import { useLocation } from 'react-router-dom'
// import MainContent from '../components/MainContent.jsx'

const YoutubeLayout = ({children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const location = useLocation();

      useEffect(() => {
        const isVideoPage = location.pathname.startsWith('/video/');
        
        if (isVideoPage && isSidebarOpen) {
          setIsSidebarOpen(false);
        } else if (!isVideoPage && !isSidebarOpen) {
          if (window.innerWidth >= 768) {
             setIsSidebarOpen(true);
          }
        }
      }, [location.pathname, isSidebarOpen]);

  // Function to toggle sidebar state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex flex-col h-screen text-white "> 
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden pt-14"> 
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`
                flex-1 overflow-y-auto p-4 
                transition-[margin-left] duration-300 ease-in-out
                ${isSidebarOpen ? 'ml-60 md:ml-60' : 'ml-0 md:ml-20'} 
                relative top-0 left-0 w-full h-full
              `}>
          {children} 
        </main>
      </div>
    </div>
  )
}

export default YoutubeLayout
