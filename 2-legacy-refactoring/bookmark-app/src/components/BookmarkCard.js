import React from 'react';

function BookmarkCard({ bookmark, metadata, onDelete }) {
  // Pas de gestion du chargement ou des erreurs de métadonnées
  const { title, url, category, createdAt } = bookmark;
  const { description, image } = metadata || {}; // Peut causer des erreurs

  // Pas de confirmation avant suppression
  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className="bookmark-card">
      {/* Images non optimisées, pas de placeholder */}
      {image && <img src={image} alt={title} className="bookmark-image" />}
      
      <div className="bookmark-content">
        <h3>{title}</h3>
        {/* URL non validée */}
        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
        
        {/* Description peut être très longue et casser la mise en page */}
        {description && <p>{description}</p>}
        
        <div className="bookmark-footer">
          {/* Pas de formatage de date */}
          <span>{createdAt}</span>
          <span className="category">{category}</span>
          {/* Pas de style disabled pendant la suppression */}
          <button onClick={handleDelete} className="delete-btn">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookmarkCard; 