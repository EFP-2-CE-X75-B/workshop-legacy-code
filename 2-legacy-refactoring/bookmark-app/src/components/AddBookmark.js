import React, { useState } from 'react';

function AddBookmark({ onAdd }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation d'URL très basique
    if (!url.includes('http')) {
      alert('URL invalide');
      return;
    }

    // Pas de nettoyage des entrées
    onAdd(url, title);
    
    // Reset sans attendre la confirmation
    setUrl('');
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-bookmark">
      {/* Pas de retour visuel sur la validité de l'URL */}
      <input
        type="text"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="URL"
        required
      />
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Titre (optionnel)"
      />
      <button type="submit">Ajouter</button>
    </form>
  );
}

export default AddBookmark; 