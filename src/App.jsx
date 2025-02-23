import { useState } from 'react'
import MoodSelector from './components/MoodSelector'
import HealingSession from './components/HealingSession'
import './App.css'

function App() {
  const [currentMood, setCurrentMood] = useState(null)
  const [showSession, setShowSession] = useState(false)

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood)
    setShowSession(true)
  }

  const handleCloseSession = () => {
    setShowSession(false)
    setCurrentMood(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Theophostic Prayer Ministry Guide</h1>
        <p>Find healing through truth and divine guidance</p>
      </header>

      {!showSession ? (
        <MoodSelector onMoodSelect={handleMoodSelect} />
      ) : (
        <HealingSession 
          currentMood={currentMood} 
          onClose={handleCloseSession} 
        />
      )}
    </div>
  )
}

export default App