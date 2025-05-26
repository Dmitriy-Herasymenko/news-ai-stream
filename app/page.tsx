"use client";

import { useState, useEffect } from "react";
import NewsList from "./components/NewsList/NewsList";
import CategoriesMenu from "./components/CategoriesMenu/CategoriesMenu";
import { fetchNews } from "./api/fetchNews";

export default function Home() {
  const [category, setCategory] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await fetchNews(category);
        setArticles(data);
        console.log("data page", data)
      } catch (error) {
        console.error("Error fetching news:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [category]);
console.log("articles", articles)
  return (
    <main className="max-w-8xl mx-auto p-6">
      <CategoriesMenu currentCategorySlug={category} onCategoryChange={setCategory} />

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : articles?.length > 0 ? (
        <NewsList articles={articles} />
      ) : (
        <p className="text-center text-gray-500">No news available</p>
      )}
    </main>
  );
}
