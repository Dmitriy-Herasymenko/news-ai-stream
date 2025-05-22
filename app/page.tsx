import NewsList from "./components/NewsList/NewsList";
import CategoriesMenu from "./components/CategoriesMenu/CategoriesMenu";
import { fetchNews } from "./api/fetchNews";

export default async function Home() {
  let articles = [];

  try {
    articles = await fetchNews();
  } catch (error) {
    console.error("Error fetching news:", error);
  }

  return (
    <main className="max-w-8xl mx-auto p-6">
      <CategoriesMenu />
      {articles.length > 0 ? (
        <NewsList articles={articles} />
      ) : (
        <p className="text-center text-gray-500">No news available</p>
      )}
    </main>
  );
}
