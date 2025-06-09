'use client';

import React from 'react';

const categories = [
  { value: "business", label: "Business" },
  { value: "entertainment", label: "Entertainment" },
  { value: "general", label: "General" },
  { value: "health", label: "Health" },
  { value: "science", label: "Science" },
  { value: "sports", label: "Sports" },
  { value: "technology", label: "Technology" },
];

type Props = {
  currentCategorySlug: string;
  onCategoryChange: (slug: string) => void;
};

export default function CategoriesMenu({ currentCategorySlug, onCategoryChange }: Props) {
  const currentCategory = categories.find(cat => cat.value === currentCategorySlug);

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      {/* Заголовок — зліва */}
      <h2 className="text-2xl sm:text-3xl font-bold border-l-4 border-red-600 pl-4 mb-4 text-gray-900">
        {currentCategory ? currentCategory.label : 'Головні новини'}
      </h2>

      {/* Мобільний селект */}
      <div className="block sm:hidden mb-6 relative">
        <select
          value={currentCategorySlug}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="appearance-none w-full border border-gray-300  text-gray-900 rounded px-4 py-2 text-lg pr-10 cursor-pointer
            focus:outline-none focus:border-red-600"
        >
          {categories.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Десктоп меню — категорії по центру */}
      <nav className="hidden sm:flex justify-center items-center gap-8 border-b border-t border-gray-300 py-3">
        {categories.map(({ label, value }) => {
          const isActive = value === currentCategorySlug;
          return (
            <a
              key={value}
              onClick={() => onCategoryChange(value)}
              className={`cursor-pointer font-semibold text-gray-800 text-base hover:text-red-600 transition-colors
                ${isActive ? 'border-b-4 border-red-600 pb-1 text-red-600' : ''}`}
            >
              {label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
