import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import clsx from "clsx";
import { translateText } from "../../../lib/translate";

interface Article {
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  source: { name: string };
  publishedAt: string;
  category?: string; // додав для прикладу
}

interface NewsListProps {
  articles: Article[];
  categories?: string[];
  language?: string;
}

export default function NewsList({
  articles,
  categories = [],
  language = "ua",
}: NewsListProps) {
  const [translatedArticles, setTranslatedArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Ефект перекладу (поки імітація перекладу)
  useEffect(() => {
    async function translateAll() {
      setIsLoading(true);
      // Імітація перекладу (тут потрібно підключити реальний translateText)
      // const translated = await Promise.all(
      //   articles.map(async (a) => ({
      //     ...a,
      //     title: await translateText(a.title, language),
      //     description: a.description
      //       ? await translateText(a.description, language)
      //       : "",
      //   }))
      // );
      // Для прикладу - без перекладу
      setTranslatedArticles(articles);
      setIsLoading(false);
    }
    translateAll();
  }, [articles, language]);

  // Фільтрація за категорією і пошуком
  const filteredArticles = useMemo(() => {
    return translatedArticles
      .filter((article) =>
        selectedCategory ? article.source.name === selectedCategory : true
      )
      .filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (article.description
            ? article.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            : false)
      );
  }, [translatedArticles, selectedCategory, searchQuery]);

  return (
    <div className="bg-white min-h-screen px-4 md:px-8">
      {/* Пошук */}
      <div className="max-w-6xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search for news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:text-black"
          aria-label="Search for news..."
        />
      </div>

      {/* Категорії */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-8 max-w-6xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(cat === selectedCategory ? null : cat)
              }
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-medium transition",
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              )}
              aria-pressed={selectedCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Лоадер */}
      {isLoading && (
        <div className="max-w-6xl mx-auto text-center py-10 text-gray-500">
          Завантаження новин...
        </div>
      )}

      {/* Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredArticles.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              Новини не знайдено.
            </p>
          )}
          {filteredArticles.map((article, i) => {
            const randomCommentsCount = Math.floor(Math.random() * 50);
            const spanClass =
              i % 7 === 0
                ? "col-span-full"
                : i % 5 === 0
                ? "sm:col-span-2"
                : "";

            const darkBackground = i % 6 === 0;

            return (
              <Link
                href={`/news/${encodeURIComponent(article.title)}`}
                key={i}
                className={clsx(
                  "group flex flex-col rounded-lg overflow-hidden border hover:shadow-md transition",
                  spanClass,
                  darkBackground ? "bg-black text-white" : "bg-white"
                )}
              >
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className={clsx(
                      "w-full h-48 object-cover transition-transform duration-300",
                      darkBackground && "opacity-80 group-hover:opacity-100"
                    )}
                  />
                )}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <h3
                    className={clsx(
                      "text-lg font-bold group-hover:underline",
                      darkBackground ? "text-white" : "text-black"
                    )}
                  >
                    {article.title}
                  </h3>
                  <p
                    className={clsx(
                      "text-sm mt-2 line-clamp-3",
                      darkBackground ? "text-gray-300" : "text-gray-600"
                    )}
                  >
                    {article.description}
                  </p>
                  <div
                    className={clsx(
                      "text-xs mt-4 flex flex-col gap-1",
                      darkBackground ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    <span>
                      {article.source.name} —{" "}
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                    <span>💬 {randomCommentsCount} коментарів</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
