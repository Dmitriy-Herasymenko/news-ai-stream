import React from 'react';
import Link from 'next/link';

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
}

export default function NewsList({ articles }: NewsListProps) {
  return (
    <div className="news-list flex flex-col gap-5 max-w-4xl mx-auto p-4">
    {articles.map((article, i) => (
      <Link
        href={`/news/${encodeURIComponent(article.title)}`}
        key={i}
        className="flex border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
        target="_blank" // якщо хочеш у новому вікні, або прибрати
      >
        {article.urlToImage && (
          <img
            src={article?.urlToImage}
            alt={article.title}
            className="w-40 object-cover"
          />
        )}
        <div className="p-4 flex flex-col justify-between">
          <h3 className="text-lg font-semibold">{article.title}</h3>
          <p className="text-gray-600">{article.description}</p>
          <small className="text-gray-400 mt-2">
            {article.source.name} — {new Date(article.publishedAt).toLocaleDateString()}
          </small>
        </div>
      </Link>
    ))}
  </div>
  );
}
