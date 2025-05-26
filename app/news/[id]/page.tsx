// app/news/[id]/page.tsx

import { notFound } from "next/navigation";
import { generateCommentsCohereChat } from "../../../lib/generateComments";

type ArticleDetailProps = {
  params: {
    id: string;
  };
};

async function fetchNewsDetail(id: string) {
  const res = await fetch(
    `https://newsapi.org/v2/everything?q=${id}&apiKey=${process.env.NEWS_API_KEY}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  if (!data.articles || data.articles.length === 0) {
    return null;
  }

  return data.articles[0];
}

// Новий запит для схожих новин (можна за ключовими словами)
async function fetchRelatedNews(query: string) {
  const res = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      query
    )}&pageSize=4&apiKey=${process.env.NEWS_API_KEY}`,
    { cache: "no-store" }
  );
  const data = await res.json();
  if (!data.articles || data.articles.length === 0) return [];
  return data.articles;
}

export default async function NewsDetail({ params }: ArticleDetailProps) {
  if (!params?.id) return notFound();

  const article = await fetchNewsDetail(params.id);
  if (!article) return notFound();

  const comments = await generateCommentsCohereChat(
    article.title,
    article.description || ""
  );
  const relatedNews = await fetchRelatedNews(article.title);

  // Припустимо, що теги беремо з опису або джерела, тут простий приклад
  const tags = article.title.split(" ").slice(0, 5);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 border-l-4 border-red-600 pl-4 text-gray-900">
        {article.title}
      </h1>

      {article.content && (
        <p className="mb-6 leading-relaxed text-gray-700 text-lg">
          {article.content?.replace(/\s*\[\+\d+\s*chars\]$/, "")}
        </p>
      )}

      {article.urlToImage && (
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-auto rounded-lg mb-8 shadow-md"
        />
      )}

      <p className="mb-6 leading-relaxed text-gray-800">
        {article.content || article.description}
      </p>

      <div className="text-sm text-gray-500 mb-10">
        Джерело: <span className="font-semibold">{article.source.name}</span> —{" "}
        {new Date(article.publishedAt).toLocaleString()}
      </div>

      {/* Теги */}
      <div className="mb-10">
        <h3 className="font-semibold text-gray-700 mb-2">Теги:</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-red-600 hover:text-white transition"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Соціальні кнопки */}
      <div className="mb-12 flex gap-4">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            article.url
          )}`}
          target="_blank"
          rel="noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
            article.url
          )}&text=${encodeURIComponent(article.title)}`}
          target="_blank"
          rel="noreferrer"
          className="bg-sky-400 text-white px-4 py-2 rounded hover:bg-sky-500 transition"
        >
          Twitter
        </a>
        <a
          href={`https://t.me/share/url?url=${encodeURIComponent(
            article.url
          )}&text=${encodeURIComponent(article.title)}`}
          target="_blank"
          rel="noreferrer"
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
        >
          Telegram
        </a>
      </div>

      {/* Схожі новини */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6 border-b border-gray-300 pb-2 text-gray-900">
          Схожі новини
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relatedNews.map((news, i) => (
            <a
              key={i}
              href={news.url}
              target="_blank"
              rel="noreferrer"
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {news.urlToImage && (
                <img
                  src={news.urlToImage}
                  alt={news.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {news.title}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-3">
                  {news.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Коментарі */}
      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-6 border-b border-gray-300 pb-2 text-gray-900">
          Коментарі
        </h2>

        {comments.length > 0 ? (
          <ul className="flex flex-wrap gap-6">
            {comments.map(({ name, avatar, comment }, i) => {
              const wordCount = comment.split(" ").length;
              const isLong = wordCount > 30;

              return (
                <li
                  key={i}
                  className={`flex flex-col items-center p-6 border border-gray-300 rounded-lg shadow-sm bg-white hover:shadow-lg transition-shadow duration-300
          ${isLong ? "w-full" : "w-full sm:w-[48%] lg:w-[30%]"}`}
                  aria-label={`Коментар від ${name}`}
                >
                  <img
                    src={avatar}
                    alt={`Аватар користувача ${name}`}
                    className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-red-600"
                  />
                  <p className="font-semibold text-red-700 mb-2 text-center">
                    {name}
                  </p>
                  <p className="text-gray-700 text-center">{comment}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500 italic">Коментарів поки немає</p>
        )}
      </section>
    </main>
  );
}
