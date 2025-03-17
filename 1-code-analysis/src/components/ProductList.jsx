/**
 * Les améliorations principales apportées sont :
Architecture :
  - Conversion en composant fonctionnel
  - Extraction de la logique dans des hooks personnalisés (useProducts, useProductFilters)
  - Séparation en sous-composants (ProductCard, SearchBar)
  - Meilleure organisation du code
Performance :
  - Utilisation de useMemo pour la logique de filtrage
  - Optimisation des re-rendus avec useCallback
  - Extraction des composants pour limiter les re-rendus
Gestion d'état :
  - État géré avec useState au lieu de this.state
  - Séparation claire des responsabilités
  - Suppression de l'état dérivé filteredProducts
Gestion des erreurs :
  - Meilleure gestion des erreurs avec messages explicites
  - États de chargement appropriés
  - Possibilité de réessayer en cas d'erreur
UX/UI :
  - Meilleure structure des composants
  - Messages d'état plus clairs
  - Interface plus intuitive avec des icônes pour le tri
Bonnes pratiques :
  - Nommage explicite des variables et fonctions
  - Utilisation correcte des clés dans les listes (product.id)
  - Code plus modulaire et maintenable
  - Typage implicite plus clair
  - Extension .jsx pour les composants React
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://api.example.com/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error };
};

const useProductFilters = () => {
  const [sortOrder, setSortOrder] = useState('asc');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return {
    filters: {
      sortOrder,
      categoryFilter,
      searchQuery,
    },
    setters: {
      setSortOrder,
      setCategoryFilter,
      setSearchQuery,
    },
  };
};

const ProductCard = ({ product, onSelect }) => (
  <div className="product-card">
    <h3>{product.name}</h3>
    <p className="price">{product.price}</p>
    <button onClick={() => onSelect(product)}>
      View Details
    </button>
  </div>
);

const SearchBar = ({ value, onChange }) => (
  <input
    type="text"
    placeholder="Search products..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="search-input"
  />
);

export default function ProductList() {
  const { products, loading, error } = useProducts();
  const { filters, setters } = useProductFilters();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    if (filters.categoryFilter !== 'all') {
      result = result.filter(product => 
        product.category === filters.categoryFilter
      );
    }
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query)
      );
    }
    
    return result.sort((a, b) => {
      const multiplier = filters.sortOrder === 'asc' ? 1 : -1;
      return (a.price - b.price) * multiplier;
    });
  }, [products, filters.categoryFilter, filters.searchQuery, filters.sortOrder]);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="filters-section">
        <SearchBar
          value={filters.searchQuery}
          onChange={setters.setSearchQuery}
        />
        
        <select
          value={filters.categoryFilter}
          onChange={(e) => setters.setCategoryFilter(e.target.value)}
          className="category-filter"
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>
        
        <button
          onClick={() => setters.setSortOrder(
            filters.sortOrder === 'asc' ? 'desc' : 'asc'
          )}
          className="sort-button"
        >
          Price: {filters.sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
            />
          ))
        )}
      </div>
    </div>
  );
} 