'use client';

import { useState, useEffect } from "react";
import NewsList from "./components/NewsList/NewsList";
import CategoriesMenu from "./components/CategoriesMenu/CategoriesMenu";
import WeatherWidget from './components/WeatherWidget/WeatherWidget';
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
      } catch (error) {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [category]);

  return (
    <main className="max-w-8xl mx-auto p-6">
      <CategoriesMenu currentCategorySlug={category} onCategoryChange={setCategory} />

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : articles?.length > 0 ? (
        <div className="flex flex-col gap-6">
          {/* Мобільна версія — погода над новинами */}
          <div className="w-full md:hidden mb-6">
            <WeatherWidget />
          </div>

          {/* Десктоп версія — новини зліва, погода справа */}
          <div className="hidden md:flex gap-12 justify-center">
            <div className="w-3/4">
              <NewsList articles={articles} />
            </div>
            <div className="">
              <WeatherWidget />
            </div>
          </div>

          {/* Мобільна версія — новини під погодою */}
          <div className="md:hidden w-full">
            <NewsList articles={articles} />
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No news available</p>
      )}
    </main>
  );
}
