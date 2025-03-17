import React from 'react';

function BookmarkFilter({ currentCategory, onCategoryChange }) {
  // Catégories en dur dans le composant
  const categories = ['all', 'uncategorized', 'work', 'personal', 'reading'];

  return (
    <div className="bookmark-filter">
      {/* Pas de style actif clair */}
      {categories.map(category => (
        // key utilisant l'index
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={currentCategory === category ? 'active' : ''}
        >
          {/* Pas de capitalisation ou traduction */}
          {category}
        </button>
      ))}
    </div>
  );
}

export default BookmarkFilter; 