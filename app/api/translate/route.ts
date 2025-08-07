import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json({ error: "Missing text or targetLang" }, { status: 400 });
    }

    const res = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: "ua",
        target: targetLang,
        format: "text",
      }),
    });

    const data = await res.json();

    return NextResponse.json({ translatedText: data?.translatedText });
  } catch (error) {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
