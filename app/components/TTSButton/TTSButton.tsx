"use client";

import { useEffect } from "react";

export default function TTSButton({ text }: { text: string }) {
  function speak(text: string) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1;
      utterance.pitch = 1;

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang === 'en-US') || voices[0];
      if (preferred) {
        utterance.voice = preferred;
      }
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Ваш браузер не підтримує озвучення.');
    }
  }

  return (
    <button
      onClick={() => speak(text)}
      className=" px-4 mb-2 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
    >
      🔊 Слухати новину
    </button>
  );
}
