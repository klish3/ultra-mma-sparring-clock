import { useState } from 'react'
import Stopwatch from './components/Stopwatch'
import './App.css'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Stopwatch 
        rounds={3} 
        roundDuration={120} // 2 minutes in seconds
        breakDuration={60}  // 1 minute in seconds
      />
    </div>
  )
}

export default App