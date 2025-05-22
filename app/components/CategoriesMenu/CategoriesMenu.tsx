'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const categories = [
  { name: 'Головні новини', slug: 'main' },
  { name: 'Політика', slug: 'politics' },
  { name: 'Економіка', slug: 'economics' },
  { name: 'Спорт', slug: 'sports' },
];

export default function CategoriesMenu() {
  const [currentCategorySlug, setCurrentCategorySlug] = useState('main');

  const currentCategory = categories.find(cat => cat.slug === currentCategorySlug);

  return (
    <div className=" mx-auto p-4">
      <h2 className="text-3xl font-bold border-l-4 border-red-600 pl-4 mb-6 text-gray-900">
        {currentCategory ? currentCategory.name : 'Головні новини'}
      </h2>

      <nav className="flex items-center justify-center gap-8 mb-8 border-b border-t border-gray-300 pb-3 pt-3">
        {categories.map(({ name, slug }) => {
          const isActive = slug === currentCategorySlug;
          return (
            <a
              key={slug}
              onClick={() => setCurrentCategorySlug(slug)}
              className={`text-lg font-semibold cursor-pointer ${
                isActive
                  ? 'text-red-600 border-b-4 border-red-600 pb-1'
                  : 'text-gray-700 hover:text-red-600 transition-colors'
              }`}
            >
              {name}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
