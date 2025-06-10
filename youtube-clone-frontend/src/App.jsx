import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import YouTubeLayout from './pages/YoutubeLayout.jsx'
import VideoPlayerSection from './pages/VideoPlayerSection.jsx'
import Search from './components/Search.jsx'
import MainContent from './components/MainContent.jsx'
import ChannelPage from './components/ChannelPage.jsx'
import ChannelCustomization from './components/ChannelCustomization.jsx'

const App = () => {
  return (
    <div className='h-screen bg-black text-white '>
    <BrowserRouter>
    <Routes>
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/trending' element={<YouTubeLayout>
                <MainContent type="trending" />
              </YouTubeLayout>} />
      <Route path='/subscription' element={<YouTubeLayout>
                <MainContent type="sub" />
              </YouTubeLayout>} />
      <Route path='/' element={<YouTubeLayout>
                <MainContent type="random" />
              </YouTubeLayout>} />
      <Route path="/video/:id" element={<YouTubeLayout>
                <VideoPlayerSection />
              </YouTubeLayout>} />
      <Route path="/search" element={<YouTubeLayout>
                <Search/>
              </YouTubeLayout>} />
      <Route path="/channel/:id" element={<YouTubeLayout>
                <ChannelPage/>
              </YouTubeLayout>} />
      <Route path="/edit-channel" element={<YouTubeLayout>
                <ChannelCustomization/>
              </YouTubeLayout>} />
    </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
