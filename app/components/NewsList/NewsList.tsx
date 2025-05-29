import React, { useState, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";
import { translateText } from "../../../lib/translate"
interface Article {
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  source: { name: string };
  publishedAt: string;
}

interface NewsListProps {
  articles: Article[];
  categories?: string[];
  language?: string
}

export default function NewsList({ articles, categories = [], language = 'ua' }: NewsListProps) {
  const [translatedArticles, setTranslatedArticles] = useState<Article[]>([]);
console.log("translatedArticles1111", translatedArticles)
  useEffect(() => {
    async function translateAll() {
      // const translated = await Promise.all(
      //   articles.map(async (a) => ({
      //     ...a,
      //     title: await translateText(a.title, language),
      //     description: a.description
      //       ? await translateText(a.description, language)
      //       : "",
      //   }))
      // );
      const arws = await translateText("hellow world", language)
      console.log("arws", arws)
      // setTranslatedArticles(translated);
    }

    translateAll();
  }, [articles, language]);

  return (
    <div className="bg-white min-h-screen  px-4 md:px-8">
      {/* Категорії */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((cat, i) => (
            <button
              key={i}
              className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium transition"
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {articles?.map((article, i) => {
          const randomCommentsCount = Math.floor(Math.random() * 50);
          const spanClass =
            i % 7 === 0
              ? "col-span-full" // повна ширина
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
    </div>
  );
}
