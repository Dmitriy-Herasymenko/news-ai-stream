
import { notFound } from "next/navigation";
import ClientCommentsWrapper from "../../components/ClientCommentsWrapper";
import { Card, CardContent } from "@/app/components/ui/card";
import TTSButton from "@/app/components/TTSButton/TTSButton";


interface ArticleDetailProps {
  params: { id: string };
}


async function fetchNewsDetail(id: string) {
  const res = await fetch(
    `https://newsapi.org/v2/everything?q=${id}&apiKey=${process.env.NEWS_API_KEY}`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return data.articles?.[0] || null;
}

async function fetchRelatedNews(query: string) {
  const res = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=4&apiKey=${process.env.NEWS_API_KEY}`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return data.articles || [];
}

async function fetchRecommendedNews() {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&pageSize=4&apiKey=${process.env.NEWS_API_KEY}`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return data.articles || [];
}

export default async function NewsDetail({ params }: ArticleDetailProps) {
  const { id } = params;
  if (!id) return notFound();

  const article = await fetchNewsDetail(id);
  if (!article) return notFound();

  const relatedNews = await fetchRelatedNews(article.title);
  const tags = article.title.split(" ").slice(0, 5);

  const recommendedNews = await fetchRecommendedNews();


  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 border-l-4 border-red-600 pl-4">
        {article.title}
      </h1>


      {article.urlToImage && (
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-auto rounded-lg mb-8 shadow-md"
        />
      )}

      <p className="mb-6 leading-relaxed">
        {article.content?.replace(/\s*\[\+\d+\s*chars\]$/, "") || article.description}
      </p>
       <TTSButton text={`${article.title}. ${article.content || ''}`} />

      <div className="text-sm text-muted-foreground mb-10">
        Source: <span className="font-semibold">{article.source.name}</span> — {new Date(article.publishedAt).toLocaleString()}
      </div>

      <section className="mb-10">
        <h3 className="font-semibold mb-2">Tags:</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: string[], i: number) => (
            <span
              key={i}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-red-600 hover:text-white transition"
            >
              #{tag}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-12 flex gap-4">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}`}
          target="_blank"
          rel="noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(article.url)}&text=${encodeURIComponent(article.title)}`}
          target="_blank"
          rel="noreferrer"
          className="bg-sky-400 text-white px-4 py-2 rounded hover:bg-sky-500 transition"
        >
          Twitter
        </a>
        <a
          href={`https://t.me/share/url?url=${encodeURIComponent(article.url)}&text=${encodeURIComponent(article.title)}`}
          target="_blank"
          rel="noreferrer"
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
        >
          Telegram
        </a>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6 border-b pb-2">Related news</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relatedNews.map((news: any, i: number) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              {news.urlToImage && (
                <img
                  src={news.urlToImage}
                  alt={news.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">
                  {news.title}
                </h3>
                <p className="text-sm mt-2 line-clamp-3">
                  {news.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6 border-b pb-2">Recommended for you</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendedNews.map((news: any, i: number) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              {news.urlToImage && (
                <img
                  src={news.urlToImage}
                  alt={news.title}
                  className="w-full h-40 object-cover" 
                />
              )}
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">
                  <a href={`/news/${encodeURIComponent(news.title)}`} className="hover:underline">
                    {news.title}
                  </a>
                </h3>
                <p className="text-sm mt-2 line-clamp-3">
                  {news.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-6 border-b pb-2">Comments</h2>
        <ClientCommentsWrapper
          title={article.title}
          description={article.description || ""}
        />
      </section>
    </main>
  );
}
