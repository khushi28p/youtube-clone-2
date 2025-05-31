import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import YouTubeLayout from './pages/YoutubeLayout.jsx'

const App = () => {
  return (
    
    <div className='h-screen bg-cod-gray text-white '>
    <BrowserRouter>
    <Routes>
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/trending' element={<YouTubeLayout type="trending" />} />
      <Route path='/subscription' element={<YouTubeLayout type="sub" />} />
      <Route path='/' element={<YouTubeLayout type="random" />} />
    </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
