import NewsList from "./components/NewsList";
import { fetchNews } from "./api/fetchNews";



export default async function Home() {
  let articles = [];

  try {
    articles = await fetchNews();
  } catch (error) {
    console.error("Error fetching news:", error);
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
<h2 className="text-3xl font-bold border-l-4 border-red-600 pl-4 mb-6 text-gray-900">
  Головні новини
</h2>
      {articles.length > 0 ? (
        <NewsList articles={articles} />
      ) : (
        <p className="text-center text-gray-500">No news available</p>
      )}
    </main>
  );
}
