export async function fetchNews() {
    const apiKey = process.env.NEWS_API_KEY;
    const res = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
  
    if (!res.ok) {
      throw new Error('Failed to fetch news');
    }
    const data = await res.json();
    return data.articles;
  }
  