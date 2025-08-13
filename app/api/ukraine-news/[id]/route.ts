import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import iconv from "iconv-lite";
import he from "he";
import { load } from "cheerio";
import { generateUniqueId } from "@/app/utils/generateId";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

const feeds = [
  "https://www.pravda.com.ua/rss/",
  "https://nv.ua/rss/all.xml",
  "https://rss.unian.net/site/news_ukr.rss",
];

const categoryMap: any = {
  "економіка": "business",
  "бізнес": "business",
  "здоров'я": "health",
  "медицина": "health",
  "наука": "science",
  "технології": "technology",
  "техно": "technology",
  "спорт": "sports",
  "розваги": "entertainment",
  "культура": "entertainment",
  "суспільство": "general",
  "політика": "general",
  "новини": "general",
  "світ": "general",
};

function mapCategory(inputCategories: string[]): string[] {
  return inputCategories
    .map((cat) => categoryMap[cat.toLowerCase()] || null)
    .filter(Boolean);
}

function detectEncoding(xmlSample: string): string {
  const match = xmlSample.match(/<\?xml.+encoding=["'](.+?)["']/i);
  return match ? match[1].toLowerCase() : "utf-8";
}

async function extractOgImageFromPage(url: string): Promise<string> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const html = await res.text();
    const $ = load(html);
    return $('meta[property="og:image"]').attr("content") || "";
  } catch (e) {
    console.warn("OG image fetch failed for:", url);
    return "";
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const requestedId = params.id; // тепер шукатимемо по id
    const allNews: any[] = [];

    for (const url of feeds) {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (RSS Parser)" } });
      const buffer = await res.arrayBuffer();
      const buf = Buffer.from(buffer);
      const encoding = detectEncoding(buf.toString("utf8"));
      const decoded = iconv.decode(buf, encoding);
      const json = parser.parse(decoded);

      const items = json.rss?.channel?.item || [];
      const sourceTitle = he.decode(json.rss?.channel?.title || "");

      const parsedItems = await Promise.all(
        items.map(async (item: any) => {
          let imageUrl = "";

          if (item.description) {
            const $ = load(item.description);
            const img = $("img").first();
            if (img) imageUrl = img.attr("src") || "";
          }

          if (!imageUrl && item["media:content"]?.["@_url"]) {
            imageUrl = item["media:content"]["@_url"];
          }

          if (!imageUrl && item.enclosure?.["@_url"]) {
            imageUrl = item.enclosure["@_url"];
          }

          if (!imageUrl && item.link) {
            imageUrl = await extractOgImageFromPage(item.link);
          }

          const rawCategories =
            typeof item.category === "string"
              ? [item.category]
              : Array.isArray(item.category)
              ? item.category
              : [];

          const decodedCategories = rawCategories.map((cat: string) => he.decode(cat));
          const normalizedCategories = mapCategory(decodedCategories);

          return {
            id: generateUniqueId(), // тут точно створюється унікальний id
            title: he.decode(item.title || ""),
            link: item.link || "",
            pubDate: item.pubDate || "",
            source: {
              id: sourceTitle,
              name: sourceTitle,
            },
            description: he.decode(item.description || ""),
            urlToImage: imageUrl,
            categories: normalizedCategories,
          };
        })
      );

      allNews.push(...parsedItems);
    }

    // Шукаємо новину по id
    const newsItem = allNews.find((article) => article.id === requestedId);

    if (!newsItem) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(newsItem);
  } catch (error) {
    console.error("RSS fetching error:", error);
    return NextResponse.json({ error: "Не вдалося завантажити новини" }, { status: 500 });
  }
}
