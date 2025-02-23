import { useState, useEffect } from 'react'
import OpenAI from 'openai'
import './components/HealingSession.css'

const HealingSession = ({ onClose }) => {
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastRequestTime, setLastRequestTime] = useState(0)

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  })

  useEffect(() => {
    const welcomeMessage = {
      role: 'assistant',
      content: `Welcome! Ho'oponopono is an ancient Hawaiian practice of healing through forgiveness. It uses four powerful phrases: "I'm sorry" - Acknowledging our part in situations "Please forgive me" - Opening the door to healing "Thank you" - Expressing gratitude "I love you" - Transforming through love Would you like to share what's on your mind? I'm here to support your healing journey.`
    }

    const timer = setTimeout(() => {
      setMessages([welcomeMessage])
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userInput.trim()) return

    // Enforce 5-second delay between requests
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
    if (timeSinceLastRequest < 5000) {
      setError(`Please wait ${Math.ceil((5000 - timeSinceLastRequest) / 1000)} seconds before sending another message`)
      return
    }

    setIsLoading(true)
    setError(null)
    const newMessage = { role: 'user', content: userInput }
    setMessages(prev => [...prev, newMessage])
    setUserInput('')

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a compassionate healing guide specializing in Ho'oponopono practice. 
            Guide users through emotional healing using the four Ho'oponopono phrases in a general, universal context:
            - I'm sorry (expressing universal compassion)
            - Please forgive me (as a healing affirmation)
            - Thank you (expressing gratitude)
            - I love you (expressing universal love)

            IMPORTANT: 
            - NEVER suggest you have any role in the user's feelings
            - NEVER apologize for causing their emotions
            - NEVER imply any pre-existing relationship
            
            Instead:
            - Acknowledge their feelings with empathy
            - Guide them to use the Ho'oponopono phrases for their own healing
            - Offer supportive, general guidance
            - Keep responses focused on their self-healing journey
            
            Example response:
            "I hear that you're feeling [emotion]. The practice of Ho'oponopono offers these healing phrases to help process these feelings..."

            Keep responses concise, caring, and focused on empowering their healing journey.`
          },
          ...messages.slice(-4), // Only keep last 4 messages for context
          newMessage
        ],
        temperature: 0.7,
        max_tokens: 150,
      })

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.choices[0].message.content
      }])
      setLastRequestTime(now)
    } catch (error) {
      console.error('Error:', error)
      if (error.status === 429) {
        setError("We've reached our message limit. Please try again in a few minutes.")
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-container">
      <div className="healing-session">
        <div className="session-header">
          <h2>Healing Session</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="chat-container">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              {message.content}
            </div>
          ))}
          
          {isLoading && (
            <div className="message processing">
              <span>●</span>
              <span>●</span>
              <span>●</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Share what's on your mind..."
            disabled={isLoading}
            rows={10}
          />
          <button type="submit" disabled={isLoading || !userInput.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

function App() {
  const [showSession, setShowSession] = useState(true)

  const handleClose = () => {
    setShowSession(false)
  }

  return (
    <div className="app-container">
      {showSession && (
        <HealingSession
          onClose={handleClose}
        />
      )}
    </div>
  )
}

export default App