import { translateTextToUkrCohere } from './translate';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines?country=ua&language=uk';

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

export async function fetchTopHeadlinesAndTranslate(): Promise<Article[]> {
  console.log('Fetching top headlines...');
  const res = await fetch(`${NEWS_API_URL}&apiKey=${NEWS_API_KEY}`);

  if (!res.ok) {
    throw new Error('Failed to fetch news');
  }

  const data: NewsApiResponse = await res.json();
  console.log(`Fetched ${data.articles.length} articles.`);

  // Тест перекладу
  const testTranslation = await translateTextToUkrCohere("Hello world");
  console.log("Test translation result:", testTranslation);

  // Перекладаємо перші 5 новин (заголовок і опис)
  const translatedArticles = await Promise.all(
    data.articles.slice(0, 5).map(async (article) => {
      const translatedTitle = await translateTextToUkrCohere(article.title);
      const translatedDescription = article.description
        ? await translateTextToUkrCohere(article.description)
        : null;

      return {
        ...article,
        title: translatedTitle,
        description: translatedDescription,
      };
    })
  );

  console.log('Translation done, returning articles.');
  return translatedArticles;
}
