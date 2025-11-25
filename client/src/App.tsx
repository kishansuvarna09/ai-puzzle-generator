import { useState } from 'react'
import { GameManager } from './components/GameManager'
import { LandingPage } from './components/LandingPage'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="app">
      <div className="bg-effects">
        <div className="bg-dots"></div>
        <div className="bg-wave"></div>
        <div className="bg-wave wave2"></div>
      </div>
      {isPlaying ? (
        <GameManager />
      ) : (
        <LandingPage onPlay={() => setIsPlaying(true)} />
      )}
    </div>
  )
}

export default App
