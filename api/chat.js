import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Note: no VITE_ prefix
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, systemPrompt } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 250,
    });

    res.status(200).json(response.choices[0].message);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ 
      error: error.status === 429 
        ? "Please wait a moment before sending another message." 
        : "Something went wrong. Please try again."
    });
  }
}