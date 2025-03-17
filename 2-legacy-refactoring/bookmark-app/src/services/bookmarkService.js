// Pas de gestion de la taille du localStorage
const STORAGE_KEY = 'bookmarks';

// Pas de gestion d'erreur
export const loadBookmarks = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Sauvegarde synchrone qui peut bloquer
export const saveBookmarks = (bookmarks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
};

// Fonction de récupération des métadonnées non optimisée
export const fetchMetadata = async (url) => {
  try {
    // Appel direct à l'API sans cache ni rate limiting
    const response = await fetch(`https://api.metadata.io/v1/metadata?url=${url}`);
    if (!response.ok) throw new Error('Metadata fetch failed');
    
    const data = await response.json();
    
    // Pas de validation ou nettoyage des données
    return {
      title: data.title,
      description: data.description,
      image: data.image,
      favicon: data.favicon
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    // Retourne undefined au lieu d'un objet cohérent
    return undefined;
  }
};

// Pas de fonction de nettoyage du cache
// Pas de fonction de validation d'URL
// Pas de gestion de la limite de stockage 