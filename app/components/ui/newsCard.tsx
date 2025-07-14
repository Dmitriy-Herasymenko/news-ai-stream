"use client";

import Link from "next/link";
import clsx from "clsx";
import { Badge } from "@/app/components/ui/badge";

interface Article {
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  source: { name: string };
  publishedAt: string;
}

interface NewsCardProps {
  article: Article;
  index: number;
}

export function NewsCard({ article, index }: NewsCardProps) {
  const randomCommentsCount = Math.floor(Math.random() * 50);

  const spanClass =
    index % 7 === 0 ? "col-span-full" : index % 5 === 0 ? "sm:col-span-2" : "";

  const darkBackground = index % 6 === 0;

  return (
    <Link
      href={`/news/${encodeURIComponent(article.title)}`}
      className={clsx(
        "group flex flex-col rounded-lg overflow-hidden border hover:shadow-md transition",
        spanClass,
        darkBackground ? "bg-black  text-white" : "bg-white dark:bg-[#1A1A1A]"
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
            darkBackground ? "text-white" : "text-black dark:text-gray-100"
          )}
        >
          {article.title}
        </h3>
        <p
          className={clsx(
            "text-sm mt-2 line-clamp-3",
            darkBackground ? "text-gray-300" : "text-gray-600 dark:text-gray-300"
          )}
        >
          {article.description}
        </p>
        <div
          className={clsx(
            "text-xs mt-4 flex flex-col gap-1",
            darkBackground ? "text-gray-400" : "text-gray-500 dark:text-gray-400"
          )}
        >
          <Badge variant={darkBackground ? "gray400" : "gray500"}>
            {article.source.name} — {new Date(article.publishedAt).toLocaleDateString()}
          </Badge>{" "}
          <span>💬 {randomCommentsCount} comments</span>
        </div>
      </div>
    </Link>
  );
}
