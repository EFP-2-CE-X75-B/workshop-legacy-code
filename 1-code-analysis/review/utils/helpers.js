// Fichier utilitaire avec plusieurs problèmes de conception
// Pas de commentaires sur les fonctions

// Variable globale (mauvaise pratique)
var globalConfig = {
  apiUrl: 'http://api.example.com',
  defaultPageSize: 10,
  theme: 'light'
};

// Fonction avec trop de responsabilités
// Modification directe du paramètre data
export function processProductData(data) {
  // Mutation directe des paramètres
  data.forEach(item => {
    // Logique métier qui devrait être ailleurs
    item.price = Number(item.price);
    item.discountedPrice = item.price * (1 - (item.discount || 0));
    item.inStock = item.quantity > 0;
    
    // Manipulation de dates non standardisée
    item.lastUpdated = new Date(item.updatedAt).toLocaleDateString();
    
    // Mutation d'objet global
    if (item.category === 'premium') {
      globalConfig.defaultPageSize = 20;
    }
  });

  return data;
}

// Fonction utilitaire mal nommée et non pure
export function handle(arr) {
  // Nom peu descriptif
  let tmp = [];
  
  // Logique complexe qui devrait être divisée
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] === 'string') {
      tmp.push(arr[i].toLowerCase());
    } else if (typeof arr[i] === 'number') {
      tmp.push(arr[i] * 2);
    } else {
      console.log('Invalid type:', typeof arr[i]); // Mauvaise gestion d'erreur
    }
  }
  
  return tmp;
}

// Fonction avec paramètres peu clairs
export function format(p, t, c) {
  // Paramètres non explicites
  return `${p} ${t ? 'in stock' : 'out of stock'} (${c})`;
}

// Utilitaire avec duplication de code
export const validators = {
  validateEmail: (email) => {
    // Regex complexe sans explication
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
    
  validatePhone: (phone) => {
    // Duplication de logique de validation
    if (!phone) return false;
    if (phone.length < 10) return false;
    if (!/^\d+$/.test(phone)) return false;
    return true;
  },
  
  validatePassword: (password) => {
    // Duplication de logique de validation
    if (!password) return false;
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    return true;
  }
};

// Fonction avec effet de bord caché
export function cachingFetch(url) {
  // Cache global (mauvaise pratique)
  if (!window._cache) window._cache = {};
  
  if (window._cache[url]) {
    return Promise.resolve(window._cache[url]);
  }
  
  return fetch(url)
    .then(res => res.json())
    .then(data => {
      window._cache[url] = data; // Effet de bord caché
      return data;
    })
    .catch(e => {
      console.error(e); // Mauvaise gestion d'erreur
      return null; // Retour inconsistant
    });
} 