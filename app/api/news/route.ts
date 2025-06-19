import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const apiKey = process.env.NEWS_API_KEY;
  let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

  if (category) {
    url += `&category=${category}`;
  }

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
 