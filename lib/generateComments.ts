export async function generateCommentsCohereChat(articleTitle?: string, articleSummary?: string, language?: string) {
  const prompt = `
  Створи кожен раз рандомну кількість від 3 до 10 коротких коментарів до новини з заголовком "${articleTitle}" і описом "${articleSummary}".
  Коментарі повинні бути на ${language || "uk"} мові та виглядати як справжні — різні стилі, різні точки зору. Виведи список у форматі:

  1. Ім'я: Коментар
  2. ...
  `;

  const cohereRes = await fetch('https://api.cohere.ai/v1/chat', {
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

  if (!cohereRes.ok) {
    const text = await cohereRes.text();
    console.error('Cohere API error response:', text);
    throw new Error(`Cohere API error: ${cohereRes.status} ${cohereRes.statusText}`);
  }

  const cohereData = await cohereRes.json();
  const rawComments = cohereData.text?.split(/\n\d+\.\s/).filter(Boolean);

  if (!rawComments || rawComments.length === 0) return [];

  // Запитуємо стільки фейкових користувачів, скільки коментарів
  const userRes = await fetch(`https://randomuser.me/api/?results=${rawComments.length}&nat=us,gb,ua`);
  const userData = await userRes.json();

  return rawComments.map((line:any, index:any) => {
    const [namePart, ...rest] = line.split(':');
    const comment = rest.join(':').trim();

    const user = userData.results[index];
    const name = `${user.name.first} ${user.name.last}`;
    const avatar = user.picture.medium;

    return {
      name,
      avatar,
      comment
    };
  });
}
