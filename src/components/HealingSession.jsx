import { useState, useEffect } from 'react'
import OpenAI from 'openai'
import './HealingSession.css'

const HealingSession = ({ currentMood, onClose }) => {
  const [chatHistory, setChatHistory] = useState([])
  const [userInput, setUserInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  })

  // Initialize chat with welcome message
  useEffect(() => {
    const welcomeMessage = {
      type: 'welcome',
      content: `I notice you're feeling ${currentMood?.label || 'uncertain'} ${currentMood?.emoji || ''}. 
      
I'm here to guide you through Ho'oponopono, a healing practice based on four transformative phrases:

🙏 "I'm sorry" 
💫 "Please forgive me"
✨ "Thank you"
💝 "I love you"

Would you like to explore what's on your mind?`
    }
    
    setChatHistory([welcomeMessage])
  }, [currentMood])

  const processMessage = async (userMessage) => {
    try {
      setIsProcessing(true)
      setError(null)

      // Add user message to chat
      const newUserMessage = { type: 'user', content: userMessage }
      setChatHistory(prev => [...prev, newUserMessage])

      // Get AI response
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a compassionate Ho'oponopono healing guide. The user is feeling ${currentMood?.label || 'uncertain'}.

IMPORTANT GUIDELINES:
1. Always incorporate the Ho'oponopono phrases naturally:
   - "I'm sorry"
   - "Please forgive me"
   - "Thank you"
   - "I love you"
2. Keep responses under 3 sentences
3. Focus on emotional support and healing
4. Acknowledge their feelings directly
5. End with gentle encouragement

Maintain a warm, caring tone throughout.`
          },
          ...chatHistory
            .filter(msg => msg.type !== 'welcome')
            .map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 150,
      })

      // Add AI response to chat
      const aiMessage = { 
        type: 'assistant', 
        content: response.choices[0].message.content 
      }
      setChatHistory(prev => [...prev, aiMessage])

    } catch (err) {
      console.error('Error:', err)
      setError(err.status === 429 
        ? "Please wait a moment before sending another message." 
        : "Something went wrong. Please try again."
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!userInput.trim() || isProcessing) return
    
    processMessage(userInput)
    setUserInput('')
  }

  return (
    <div className="healing-session">
      <header className="session-header">
        <h2>Healing Session</h2>
        <button onClick={onClose} className="close-button" aria-label="Close session">×</button>
      </header>

      <div className="chat-container">
        {currentMood && (
          <div className="mood-indicator" role="status">
            <span>{currentMood.emoji}</span>
            <span>Feeling {currentMood.label}</span>
          </div>
        )}

        <div className="message-list">
          {chatHistory.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.type}`}
              role={message.type === 'assistant' ? 'status' : 'none'}
            >
              {message.content}
            </div>
          ))}

          {isProcessing && (
            <div className="message assistant processing">
              <span>●</span><span>●</span><span>●</span>
            </div>
          )}

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Share what's on your mind..."
          disabled={isProcessing}
          aria-label="Your message"
        />
        <button 
          type="submit" 
          disabled={isProcessing || !userInput.trim()}
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default HealingSession