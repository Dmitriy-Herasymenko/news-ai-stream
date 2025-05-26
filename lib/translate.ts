// pages/api/translate.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text, targetLang } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ error: 'Missing text or targetLang' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful translator. Translate the following text to ${targetLang} without adding extra explanation.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('OpenAI API error:', errorDetails);
      return res.status(response.status).json({ error: 'Translation failed' });
    }

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content || text;

    res.status(200).json({ translatedText });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
}
