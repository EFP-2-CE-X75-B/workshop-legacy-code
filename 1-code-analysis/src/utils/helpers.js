/**
 * Les améliorations principales apportées sont :
Gestion de la configuration :
  - Utilisation de React Context au lieu de variables globales
  - Configuration immuable et centralisée
Fonctions pures :
  - Pas de mutation des paramètres
  - Retour de nouveaux objets
  - Séparation claire des responsabilités
Validation :
  - Création d'une classe Validator réutilisable
  - Élimination de la duplication de code
  - Meilleure organisation des règles de validation
Gestion du cache :
  - Implémentation d'une classe CacheManager
  - Gestion de l'expiration du cache
  - Meilleure gestion des erreurs
  - Pas d'utilisation de variables globales
Nommage et structure :
  - Noms explicites pour les fonctions et paramètres
  - Organisation logique du code
  - Séparation des responsabilités
Gestion des erreurs :
  - Erreurs explicites et informatives
  - Logging approprié
  - Gestion cohérente des cas d'erreur
Immutabilité :
  - Utilisation de méthodes qui ne modifient pas les données d'entrée
  - Retour de nouvelles instances
 */

import { createContext, useContext } from 'react';

// Configuration via React Context au lieu d'une variable globale
export const ConfigContext = createContext(null);

export const useConfig = () => {
  const config = useContext(ConfigContext);
  if (!config) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return config;
};

export const defaultConfig = {
  apiUrl: 'http://api.example.com',
  defaultPageSize: 10,
  theme: 'light'
};

// Fonction pure qui retourne un nouvel objet au lieu de muter les données
export function processProductData(products) {
  return products.map(product => ({
    ...product,
    price: Number(product.price),
    discountedPrice: Number(product.price) * (1 - (product.discount || 0)),
    inStock: product.quantity > 0,
    lastUpdated: new Date(product.updatedAt).toISOString(),
    category: product.category
  }));
}

// Fonction renommée et séparée en responsabilités uniques
export const arrayTransform = {
  toLowerCase: (arr) => arr.filter(item => typeof item === 'string')
    .map(item => item.toLowerCase()),
    
  doubleNumbers: (arr) => arr.filter(item => typeof item === 'number')
    .map(item => item * 2),
    
  transformMixed: (arr) => {
    const result = [];
    const errors = [];
    
    arr.forEach((item, index) => {
      if (typeof item === 'string') {
        result.push(item.toLowerCase());
      } else if (typeof item === 'number') {
        result.push(item * 2);
      } else {
        errors.push({ index, type: typeof item });
      }
    });
    
    if (errors.length > 0) {
      console.error('Invalid types found:', errors);
    }
    
    return result;
  }
};

// Fonction avec paramètres explicites et types documentés
export function formatProductStock({
  productName,
  inStock,
  count
}) {
  return `${productName} ${inStock ? 'in stock' : 'out of stock'} (${count})`;
}

// Classe de validation avec logique réutilisable
export class Validator {
  static isEmpty(value) {
    return !value;
  }

  static matchesRegex(value, regex) {
    return regex.test(value);
  }

  static meetsLength(value, minLength) {
    return value.length >= minLength;
  }

  static validate(value, rules) {
    return rules.every(rule => rule(value));
  }
}

export const validators = {
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return Validator.validate(email, [
      value => !Validator.isEmpty(value),
      value => Validator.matchesRegex(value, emailRegex)
    ]);
  },
    
  validatePhone: (phone) => {
    const phoneRegex = /^\d+$/;
    return Validator.validate(phone, [
      value => !Validator.isEmpty(value),
      value => Validator.meetsLength(value, 10),
      value => Validator.matchesRegex(value, phoneRegex)
    ]);
  },
  
  validatePassword: (password) => {
    const uppercaseRegex = /[A-Z]/;
    return Validator.validate(password, [
      value => !Validator.isEmpty(value),
      value => Validator.meetsLength(value, 8),
      value => Validator.matchesRegex(value, uppercaseRegex)
    ]);
  }
};

// Cache avec gestion d'expiration et gestion d'erreurs appropriée
export class CacheManager {
  constructor(expirationTime = 5 * 60 * 1000) { // 5 minutes par défaut
    this.cache = new Map();
    this.expirationTime = expirationTime;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.expirationTime) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear() {
    this.cache.clear();
  }
}

// Fonction de fetch avec gestion de cache propre
export const createCachedFetch = (cacheManager = new CacheManager()) => {
  return async function cachedFetch(url, options = {}) {
    try {
      const cachedData = cacheManager.get(url);
      if (cachedData) {
        return cachedData;
      }

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      cacheManager.set(url, data);
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch ${url}: ${error.message}`);
    }
  };
}; 