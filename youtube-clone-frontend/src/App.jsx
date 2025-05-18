import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import YouTubeLayout from './pages/YoutubeLayout.jsx'

const App = () => {
  return (
    
      
    <BrowserRouter>
    <Routes>
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/' element={<YouTubeLayout />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
