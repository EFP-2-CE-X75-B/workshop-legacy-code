import React from 'react';
import BookmarkCard from './BookmarkCard';

// Problème : pas de virtualisation pour les longues listes
function BookmarkList({ bookmarks, metadata, onDelete }) {
  // Pas de gestion du cas vide
  return (
    <div className="bookmark-list">
      {/* Rendu de tous les éléments d'un coup, pas de pagination */}
      {bookmarks.map(bookmark => (
        // Pas de gestion d'erreur si metadata[bookmark.url] est undefined
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          metadata={metadata[bookmark.url]}
          onDelete={() => onDelete(bookmark.id)} // Nouvelle fonction à chaque rendu
        />
      ))}
    </div>
  );
}

export default BookmarkList; 