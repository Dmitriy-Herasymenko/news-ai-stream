export async function generateCommentsCohereChat(articleTitle: string, articleSummary: string) {
  const prompt = `
  Створи кожен раз рандому кількість від 3 до 100 коротких коментарів до новини з заголовком "${articleTitle}" і описом "${articleSummary}".
  Коментарі повинні виглядати як справжні — різні стилі, різні точки зору. Виведи список у форматі:

  1. Ім'я: Коментар
  2. ...
  `;

  const res = await fetch('https://api.cohere.ai/v1/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
      'Content-Type': 'application/json',
      'Cohere-Version': '2022-12-06'
    },
    body: JSON.stringify({
      model: 'command-r-plus',
      temperature: 0.7,
      chat_history: [],
      message: prompt
    })
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Cohere API error response:', text);
    throw new Error(`Cohere API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const text = data.text;

  // Розбираємо текст на окремі коментарі
  return text?.split(/\n\d+\.\s/).filter(Boolean).map(line => {
    const [namePart, ...rest] = line.split(':');
    const name = (namePart?.trim() || 'Анонім').replace(/[^a-zA-Zа-яА-ЯёЁіІїЇґҐєЄ0-9\s]/g, '');
    const comment = rest.join(':').trim();

    // Генеруємо URL до аватарки
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`;

    return {
      name,
      avatar: avatarUrl,
      comment
    };
  });
}
