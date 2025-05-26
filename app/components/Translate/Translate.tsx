import React, { useEffect, useState } from 'react';

interface TranslateProps {
  text: string;
  targetLang: string; // 'uk', 'en', 'fr' і т.д.
}

export function Translate({ text, targetLang }: TranslateProps) {
  const [translated, setTranslated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!text) {
      setTranslated(null);
      setError(null);
      return;
    }

    async function fetchTranslation() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, targetLang }),
        });

        if (!response.ok) {
          throw new Error('Помилка при перекладі');
        }

        const data = await response.json();
        setTranslated(data.translatedText);
      } catch (err) {
        setError('Не вдалося перекласти текст');
        setTranslated(text); // Показуємо оригінал при помилці
      } finally {
        setLoading(false);
      }
    }

    fetchTranslation();
  }, [text, targetLang]);

  if (loading) return <p>Перекладаю...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return <p>{translated || text}</p>;
}
