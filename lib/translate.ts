export async function translateTextToUkrCohere(text: string): Promise<string> {
    const COHERE_API_KEY = process.env.COHERE_API_KEY;
  
    if (!COHERE_API_KEY) {
      throw new Error('Missing COHERE_API_KEY');
    }
  
    const cleanText = text?.trim() ?? '';
    if (cleanText.length === 0) {
      throw new Error('Text for translation is empty or only whitespace');
    }
  
    // Додатково можна дати паузу між запитами (наприклад, 700 мс)
    await new Promise((resolve) => setTimeout(resolve, 700));
  
    const body = {
      model: 'chat-xlarge-nightly',  // обов’язково чат-модель
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that translates any text to Ukrainian.'
        },
        {
          role: 'user',
          content: cleanText
        }
      ],
      temperature: 0.3,
      max_tokens: 200,
    };
  
    console.log('Request body to Cohere:', JSON.stringify(body, null, 2));
  
    const res = await fetch('https://api.cohere.ai/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Cohere API error:', errorText);
      throw new Error(`Cohere API error: ${res.status} ${res.statusText}`);
    }
  
    const data = await res.json();
    console.log('Cohere response data:', data);
  
    return data.choices[0].message.content.trim();
  }
  