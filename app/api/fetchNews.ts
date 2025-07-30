export async function fetchNews(category?: string, country?: string) {


  if (country === "ua") {
      const params = new URLSearchParams();
  if (category) params.append("category", category);
  const res = await fetch(`/api/ukraine-news?${params.toString()}`);
    if (!res.ok) {
      throw new Error("Failed to fetch Ukrainian news");
    }

    const data = await res.json();
    return data.articles;
  }

  let url = `/api/news`;
  const params = new URLSearchParams();

  if (category) params.append("category", category);
  if (country) params.append("country", country);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch news");
  }

  const data = await res.json();
  return data.articles;
}
