import React, { useState, useEffect } from 'react';
import BookmarkList from '../components/BookmarkList';
import AddBookmark from '../components/AddBookmark';
import BookmarkFilter from '../components/BookmarkFilter';
import { loadBookmarks, saveBookmarks, fetchMetadata } from '../services/bookmarkService';

// Code legacy avec plusieurs problèmes de performance et de fiabilité
function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [category, setCategory] = useState('all');
  const [metadata, setMetadata] = useState({}); // Stockage des métadonnées sans limite
  const [loading, setLoading] = useState(false);

  // Chargement initial sans gestion d'erreur
  useEffect(() => {
    const saved = loadBookmarks();
    setBookmarks(saved);
    
    // Chargement des métadonnées pour tous les favoris d'un coup
    saved.forEach(bookmark => {
      fetchMetadata(bookmark.url).then(meta => {
        setMetadata(prev => ({
          ...prev,
          [bookmark.url]: meta
        }));
      });
    });
  }, []);

  // Sauvegarde synchrone à chaque modification
  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks]);

  // Pas de validation d'URL
  const addBookmark = (url, title) => {
    const newBookmark = {
      id: Date.now(),
      url,
      title: title || url,
      category: 'uncategorized',
      createdAt: new Date().toISOString()
    };

    // Pas de vérification de doublon
    setBookmarks(prev => [...prev, newBookmark]);

    // Chargement des métadonnées sans gestion d'erreur
    fetchMetadata(url).then(meta => {
      setMetadata(prev => ({
        ...prev,
        [url]: meta
      }));
    });
  };

  // Fonction recréée à chaque rendu
  const deleteBookmark = (id) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  // Calcul coûteux effectué à chaque rendu
  const filteredBookmarks = bookmarks
    .filter(bookmark => {
      if (category === 'all') return true;
      return bookmark.category === category;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="bookmarks-page">
      <AddBookmark onAdd={addBookmark} />
      <BookmarkFilter currentCategory={category} onCategoryChange={setCategory} />
      <BookmarkList 
        bookmarks={filteredBookmarks}
        metadata={metadata}
        onDelete={deleteBookmark}
      />
    </div>
  );
}

export default BookmarksPage; 