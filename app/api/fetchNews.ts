export async function fetchNews(category?: string) {
  console.log("category", category)
  const apiKey = process.env.NEWS_API_KEY;
  console.log("apiKey", apiKey)
  let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=3c7b78cfefcb4c95a4a786efe8b3b8d6`;

  if (category) {
    url += `&category=${category}`;  
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to fetch news');
  }

  const data = await res.json();
  console.log("data", data);
  return data.articles;
}
