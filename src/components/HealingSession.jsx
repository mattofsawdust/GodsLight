import { useState, useEffect, useRef } from 'react';
import './HealingSession.css';

const HealingSession = ({ currentMood }) => { // removed onClose prop
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Initial welcome message
    setMessages([{
      type: 'welcome',
      content: `I notice you're feeling ${currentMood.label} ${currentMood.emoji}. I'm here to guide you through Theophostic Prayer Ministry, a healing practice focused on identifying emotional wounds and receiving God's truth. This is a safe space for you to explore your feelings and experiences. Would you like to tell me more about what's bringing up these feelings for you?`
    }]);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isProcessing) return;

    const newMessage = {
      type: 'user',
      content: userInput
    };

    setMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setIsProcessing(true);

    // Add your AI response logic here
    // For now, just adding a placeholder response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: "I hear you. Can you tell me more about that?"
      }]);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="healing-session">
      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isProcessing}
        />
        <button type="submit" disabled={isProcessing || !userInput.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default HealingSession;