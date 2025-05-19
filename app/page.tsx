import NewsList from "./components/NewsList";
import { fetchNews } from "./api/fetchNews";

async function getNews() {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`
  );
  console.log("res", res);
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
}

export default async function Home() {
  let articles = [];

  try {
    articles = await fetchNews();
  } catch (error) {
    console.error("Error fetching news:", error);
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center my-5">Latest News</h1>
      {articles.length > 0 ? (
        <NewsList articles={articles} />
      ) : (
        <p className="text-center text-gray-500">No news available</p>
      )}
    </main>
  );
}
