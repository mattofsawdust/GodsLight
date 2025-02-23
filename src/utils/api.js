import { tpmGuidelines } from './tpmGuidelines';

export const sendMessage = async (messages, currentMood) => {
  const systemPrompt = createSystemPrompt(currentMood);
  
  try {
    const response = await fetch('your-api-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4", // or your preferred model
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    return await response.json();
  } catch (error) {
    throw new Error('Failed to send message');
  }
};