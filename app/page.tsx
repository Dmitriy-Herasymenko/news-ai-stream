"use client";

import { useState, useEffect } from "react";
import NewsList from "./components/NewsList/NewsList";
import CategoriesMenu from "./components/CategoriesMenu/CategoriesMenu";

import { fetchNews } from "./api/fetchNews";
import { CircularSpinner } from "@/app/components/ui/progress";
import { useNewsStore } from "@/app/stores/newsStore";


interface Article {
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  source: { name: string };
  publishedAt: string;
  category?: string;
}

export default function Home() {
  // const [category, setCategory] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const country = useNewsStore((state) => state.country);
  const setCountry = useNewsStore((state) => state.setCountry);
  const category = useNewsStore((state) => state.category);
  const setCategory = useNewsStore((state) => state.setCategory);

  useEffect(() => {
    console.log("Вибрана категорія:", category);
  }, [category]);

 const loadNews = async (categorySlug: string, country: string) => {
  setLoading(true);
  try {
    const data = await fetchNews(categorySlug, country);

    const filteredData =
      country === "ua"
        ? data
        : data.filter((news: any) => news.source?.id);

    setArticles(filteredData);
  } catch (error) {
    console.error("Error loading news:", error);
    setArticles([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadNews(category, country);
  }, [category, country]);

  const hasNews = articles.length > 0;
console.log("Articles loaded:", articles);
  return (
    <main className="relative max-w-8xl mx-auto p-2 mb:p-6">
      <CategoriesMenu currentCategorySlug={category} onCategoryChange={setCategory} />

      {loading ? (
        <CircularSpinner size={48} strokeWidth={4} fullscreen />
      ) : hasNews ? (
        <div className="relative flex justify-center">
          <div className="w-full ">
    

            <NewsList articles={articles} />
          </div>

          {/* <aside className="hidden md:block absolute right-0 top-0 w-72">
            <WeatherWidget />
          </aside> */}
        </div>
      ) : (
        <p className="text-center text-gray-500">No news</p>
      )}
    </main>
  );
}
