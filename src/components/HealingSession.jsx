import { useState, useEffect } from 'react';
import OpenAI from 'openai';
import { tpmGuidelines } from '../utils/tpmGuidelines';
import './HealingSession.css';

const HealingSession = ({ currentMood, onClose }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  // Initialize chat with welcome message
  useEffect(() => {
    const welcomeMessage = {
      type: 'welcome',
      content: `I notice you're feeling ${currentMood?.label || 'uncertain'} ${currentMood?.emoji || ''}. 

I'm here to guide you through Theophostic Prayer Ministry, a healing practice focused on identifying emotional wounds and receiving God's truth. This is a safe space for you to explore your feelings and experiences.

Would you like to tell me more about what's bringing up these feelings for you?`
    };
    
    setChatHistory([welcomeMessage]);
  }, [currentMood]);

  const createSystemPrompt = () => {
    const relevantTheme = tpmGuidelines.commonThemes[currentMood?.label] || tpmGuidelines.commonThemes.general;
    
    return `You are a compassionate Theophostic Prayer Ministry facilitator. Use these guidelines:

${JSON.stringify(tpmGuidelines.principles, null, 2)}

Current Process Stage Guidelines:
${JSON.stringify(tpmGuidelines.processSteps, null, 2)}

Relevant Theme and Approaches:
${JSON.stringify(relevantTheme, null, 2)}

IMPORTANT GUIDELINES:
1. Follow the TPM process steps naturally, starting with present emotion
2. Keep responses under 3 sentences
3. Use gentle questions to help identify lies and seek truth
4. Acknowledge feelings directly
5. Maintain a "following" position - the person has their own way to truth
6. End with gentle encouragement
7. Remember you are facilitating their connection with God's truth, not providing it

The person is feeling ${currentMood?.label || 'uncertain'}. Maintain a warm, caring tone throughout.`;
  };

  const processMessage = async (userMessage) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Add user message to chat
      const newUserMessage = { type: 'user', content: userMessage };
      setChatHistory(prev => [...prev, newUserMessage]);

      // Get AI response
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: createSystemPrompt()
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
        max_tokens: 250,
      });

      // Add AI response to chat
      const aiMessage = { 
        type: 'assistant', 
        content: response.choices[0].message.content 
      };
      setChatHistory(prev => [...prev, aiMessage]);

    } catch (err) {
      console.error('Error:', err);
      setError(err.status === 429 
        ? "Please wait a moment before sending another message." 
        : "Something went wrong. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim() || isProcessing) return;
    
    processMessage(userInput);
    setUserInput('');
  };

  return (
    <div className="healing-session">
      <header className="session-header">
        <h2>Theophostic Prayer Ministry Session</h2>
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
  );
};

export default HealingSession;