const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines?country=us';

export interface Article {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export async function fetchTopHeadlines(): Promise<NewsApiResponse> {
  const res = await fetch(`${NEWS_API_URL}&apiKey=${NEWS_API_KEY}`);

  if (!res.ok) {
    throw new Error('Failed to fetch news');
  }

  return res.json();
}
