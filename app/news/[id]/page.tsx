// app/news/[id]/page.tsx

import { notFound } from 'next/navigation';
import { generateCommentsCohereChat } from '../../../lib/generateComments';

type ArticleDetailProps = {
  params: {
    id: string;
  };
};

async function fetchNewsDetail(params: string) {
  const res = await fetch(
    `https://newsapi.org/v2/everything?q=${params.id}&apiKey=${process.env.NEWS_API_KEY}`,
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

  const comments = await generateCommentsCohereChat(article.title, article.description || '');
console.log("comments", comments)
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
        {comments.length > 0 ? (
  <ul className="space-y-4">
    {comments.map(({ name, avatar, comment }, i) => (
      <li key={i} className="border p-4 rounded shadow-sm flex items-start gap-4">
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div>
          <p className="font-semibold">{name}</p>
          <p>{comment}</p>
        </div>
      </li>
    ))}
  </ul>
) : (
  <p className="text-gray-500">Коментарів поки немає</p>
)}

      </section>
    </main>
  );
}
