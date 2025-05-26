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
    <div className="mx-auto p-4">
      <h2 className="text-3xl font-bold border-l-4 border-red-600 pl-4 mb-6 text-gray-900">
        {currentCategory ? currentCategory.label : 'Головні новини'}
      </h2>

      <nav className="flex items-center justify-center gap-8 mb-8 border-b border-t border-gray-300 pb-3 pt-3">
        {categories.map(({ label, value }) => {
          const isActive = value === currentCategorySlug;
          return (
            <a
              key={value}
              onClick={() => onCategoryChange(value)}
              className={`text-lg font-semibold cursor-pointer ${
                isActive
                  ? 'text-red-600 border-b-4 border-red-600 pb-1'
                  : 'text-gray-700 hover:text-red-600 transition-colors'
              }`}
            >
              {label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
