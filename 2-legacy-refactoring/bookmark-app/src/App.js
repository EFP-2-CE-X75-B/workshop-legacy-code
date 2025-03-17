import React from 'react';
import BookmarksPage from './pages/BookmarksPage';
import './assets/styles/App.css';

// App.js basique sans routing ni gestion d'état globale
function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Mes Favoris</h1>
      </header>
      <main>
        <BookmarksPage />
      </main>
    </div>
  );
}

export default App; 