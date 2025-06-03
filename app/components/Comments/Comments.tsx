"use client";

import { useEffect, useState } from "react";

export default function Comments({ title, description }: { title: string; description: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      setComments(data);
      setLoading(false);
    }

    fetchComments();
  }, [title, description]);

if (loading) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 mt-4 italic">Завантаження коментарів...</p>
    </div>
  );
}

  return comments.length > 0 ? (
    <ul className="flex flex-wrap gap-6">
      {comments.map(({ name, avatar, comment }, i) => {
        const wordCount = comment.split(" ").length;
        const isLong = wordCount > 30;

        return (
          <li
            key={i}
            className={`flex flex-col items-center p-6 border border-gray-300 rounded-lg shadow-sm bg-white hover:shadow-lg transition-shadow duration-300
              ${isLong ? "w-full" : "w-full sm:w-[48%] lg:w-[30%]"}`}
          >
            <img
              src={avatar}
              alt={`Аватар користувача ${name}`}
              className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-red-600"
            />
            <p className="font-semibold text-red-700 mb-2 text-center">{name}</p>
            <p className="text-gray-700 text-center">{comment}</p>
          </li>
        );
      })}
    </ul>
  ) : (
    <p className="text-gray-500 italic">Коментарів поки немає</p>
  );
}
