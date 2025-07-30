import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import iconv from "iconv-lite";
import he from "he";
import { load } from "cheerio";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

const feeds = [
  "https://www.pravda.com.ua/rss/",
  "https://nv.ua/rss/all.xml",
  "https://rss.unian.net/site/news_ukr.rss",
];

// Мапа українських категорій до твоїх
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
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const html = await res.text();
    const $ = load(html);
    const ogImage = $('meta[property="og:image"]').attr("content");
    return ogImage || "";
  } catch (e) {
    console.warn("OG image fetch failed for:", url);
    return "";
  }
}

export async function GET(req: Request) {
  try {
    const allNews: any[] = [];

    for (const url of feeds) {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (RSS Parser)" },
      });

      const buffer = await res.arrayBuffer();
      const buf = Buffer.from(buffer);
      const xmlUtf8 = buf.toString("utf8");
      const encoding = detectEncoding(xmlUtf8);
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

          // Лог для перегляду категорій з фіда
          console.log("Raw categories from feed item:", rawCategories);

          const decodedCategories = rawCategories.map((cat: string) =>
            he.decode(cat)
          );

          console.log("Decoded categories:", decodedCategories);

          const normalizedCategories = mapCategory(decodedCategories);

          console.log("Mapped categories:", normalizedCategories);

          return {
            title: he.decode(item.title || ""),
            link: item.link || "",
            pubDate: item.pubDate || "",
            source: sourceTitle,
            description: he.decode(item.description || ""),
            urlToImage: imageUrl,
            categories: normalizedCategories,
          };
        })
      );

      allNews.push(...parsedItems);
    }

    allNews.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    const { searchParams } = new URL(req.url);
    const filterCategory = searchParams.get("category")?.toLowerCase();

    console.log("Filter category from query:", filterCategory);

    // Якщо немає категорії — повертаємо всі новини
    if (!filterCategory) {
      return NextResponse.json({ articles: allNews });
    }

    // Фільтрація: шукаємо збіги по includes (часткове співпадіння)
    const filteredNews = allNews.filter((item) =>
      item.categories.some((cat: string) => cat.includes(filterCategory))
    );

    console.log("Filtered news count:", filteredNews.length);

    return NextResponse.json({ articles: filteredNews });
  } catch (error) {
    console.error("RSS fetching error:", error);
    return NextResponse.json(
      { error: "Не вдалося завантажити новини" },
      { status: 500 }
    );
  }
}
