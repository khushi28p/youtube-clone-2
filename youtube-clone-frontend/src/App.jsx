import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup.jsx'

const App = () => {
  return (
    
      
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Signup />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
