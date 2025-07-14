import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/app/components/ui/input";
import { NewsCard } from "@/app/components/ui/newsCard";

interface Article {
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  source: { name: string };
  publishedAt: string;
  category?: string;
}

interface NewsListProps {
  articles: Article[];
  categories?: string[];
  language?: string;
}

export default function NewsList({ articles }: NewsListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        (article.description?.toLowerCase().includes(query) ?? false)
    );
  }, [articles, searchQuery]);

  return (
    <div className="bg-white dark:bg-black min-h-screen px-4 md:px-8 text-gray-900 dark:text-gray-100">
      {/* Search */}
      <div className="max-w-6xl mx-auto mb-6">
        <Input
          type="text"
          placeholder="Search for news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search for news..."
          className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredArticles.length === 0 && (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
            No news found.
          </p>
        )}
        {filteredArticles.map((article, i) => (
          <NewsCard key={i} article={article} index={i} />
        ))}
      </div>
    </div>
  );
}
