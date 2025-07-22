import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import iconv from "iconv-lite";
import he from "he";
import { load } from "cheerio";

const parser = new XMLParser();

const feeds = [
  "https://www.pravda.com.ua/rss/",
  "https://nv.ua/rss/all.xml",
  "https://rss.unian.net/site/news_ukr.rss",
];

function detectEncoding(xmlSample: string): string {
  const match = xmlSample.match(/<\?xml.+encoding=["'](.+?)["']/i);
  return match ? match[1].toLowerCase() : "utf-8";
}

export async function GET() {
  try {
    const allNews: any[] = [];

    for (const url of feeds) {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (RSS Parser)",
        },
      });

      const buffer = await res.arrayBuffer();
      const buf = Buffer.from(buffer);

      // На початку декодуємо буфер в UTF-8 для пошуку encoding
      const xmlUtf8 = buf.toString("utf8");
      const encoding = detectEncoding(xmlUtf8);

      // Потім декодуємо в реальному кодуванні
      const decoded = iconv.decode(buf, encoding);

      const json = parser.parse(decoded);
      const items = json.rss?.channel?.item || [];
      console.log("items", items)

items.forEach((item: any) => {
  let imageUrl = "";

  if (item.description) {
    const $ = load(item.description);
    const img = $("img").first();
    if (img) {
      imageUrl = img.attr("src") || "";
    }
  }

  allNews.push({
    title: he.decode(item.title || ""),
    link: item.link || "",
    pubDate: item.pubDate || "",
    source: he.decode(json.rss?.channel?.title || ""),
    description: he.decode(item.description || ""),
    imageUrl,
  });
});

    }

    allNews.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    return NextResponse.json({ articles: allNews });
  } catch (error) {
    console.error("RSS fetching error:", error);
    return NextResponse.json(
      { error: "Не вдалося завантажити новини" },
      { status: 500 }
    );
  }
}
