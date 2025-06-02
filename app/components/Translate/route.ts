// app/api/translate/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { text, targetLang } = await request.json();
    console.log('Translate request:', { text, targetLang });
    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Missing text or targetLang' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful translator.' },
        { role: 'user', content: `Translate the following text to ${targetLang}: ${text}` },
      ],
    });

    const translatedText = completion.choices[0].message?.content ?? '';

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('OpenAI error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
