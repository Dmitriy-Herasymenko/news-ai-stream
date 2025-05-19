// app/news/[id]/page.tsx

import { notFound } from 'next/navigation';

type ArticleDetailProps = {
  params: {
    id: string;
  };
};

async function fetchNewsDetail(id: string) {
  const res = await fetch(
    `https://newsapi.org/v2/everything?q=${id}&apiKey=${process.env.NEWS_API_KEY}`,
    { cache: 'no-store' } // 👈 обов'язково для SSR
  );

  const data = await res.json();
  if (!data.articles || data.articles.length === 0) {
    return null;
  }

  return data.articles[0]; // беремо першу статтю
}

export default async function NewsDetail({ params }: ArticleDetailProps) {
  if (!params?.id) return notFound(); // 👈 обов’язкова перевірка

  const article = await fetchNewsDetail(params.id);

  if (!article) return notFound();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      {article.urlToImage && (
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-auto rounded mb-6"
        />
      )}
      <p className="mb-4">{article.content || article.description}</p>
      <div className="text-gray-600 mb-2">
        Source: {article.source.name} —{' '}
        {new Date(article.publishedAt).toLocaleString()}
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">Comments</h2>
        <p className="text-gray-500">Коментарі поки відсутні.</p>
      </section>
    </main>
  );
}
