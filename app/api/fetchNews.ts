


export async function fetchNews(category?: string) {
  let url = `/api/news`;
  if (category) {
    url += `?category=${category}`;
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to fetch news');
  }

  const data = await res.json();
  return data.articles;
}
