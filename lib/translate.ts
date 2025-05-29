export async function translateText(text: string, targetLang: string): Promise<string> {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang }),
    });
  
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.error || "Unknown error";
      throw new Error(`Translation failed: ${errorMessage}`);
    }
  
    const data = await res.json();
    return data.translatedText;
  }
  