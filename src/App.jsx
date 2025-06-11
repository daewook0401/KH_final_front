import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './provider/AuthContext'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <Routes>

      </Routes>
    </AuthProvider>
  )
}

export default App
