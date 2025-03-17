/**
Les principales améliorations apportées sont :
Architecture :
  - Utilisation de hooks personnalisés pour séparer la logique métier
  - Séparation des préoccupations (gestion du panier, reviews)
  - Code plus modulaire et réutilisable
Gestion d'état :
  - Utilisation appropriée des hooks useState et useEffect
  - Suppression des manipulations directes du DOM
  - Meilleure gestion des états locaux
Gestion des erreurs :
  - Ajout de gestion d'erreurs pour les appels API
  - Affichage des états de chargement
  - Validation des données
Performance :
  - Utilisation de useCallback pour les fonctions

  - Meilleures conditions de rendu
  - Optimisation des re-rendus
UX :
  - Meilleure gestion des états désactivés des boutons
  - Feedback visuel plus clair
  - Meilleure organisation des composants
Bonnes pratiques :
  - Nommage plus explicite des variables et fonctions
  - Utilisation de composants fonctionnels
  - Code plus déclaratif
  - Suppression des événements personnalisés inutiles
*/
import React, { useState, useEffect, useCallback } from 'react';

// Custom hook pour la gestion des reviews
const useProductReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://api.example.com/products/${productId}/reviews`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, error, isLoading };
};

// Custom hook pour la gestion du panier
const useCart = () => {
  const addToCart = async (productId, quantity) => {
    try {
      const response = await fetch('http://api.example.com/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  return { addToCart };
};

export default function ProductDetails({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  
  const { reviews, error: reviewsError, isLoading } = useProductReviews(product?.id);
  const { addToCart } = useCart();

  const handleQuantityChange = (increment) => {
    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + increment;
      
      if (newQuantity > product.stock) {
        alert('Not enough stock!');
        return prevQuantity;
      }
      
      return Math.max(1, newQuantity);
    });
  };

  const handleAddToCart = async () => {
    const success = await addToCart(product.id, quantity);
    
    if (success) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  if (!product) return null;

  return (
    <div className="product-details">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      
      <div className="quantity-selector">
        <button 
          onClick={() => handleQuantityChange(-1)}
          disabled={quantity <= 1}
        >
          -
        </button>
        <span>{quantity}</span>
        <button 
          onClick={() => handleQuantityChange(1)}
          disabled={quantity >= product.stock}
        >
          +
        </button>
      </div>

      <button 
        onClick={handleAddToCart}
        disabled={addedToCart || quantity > product.stock}
        className="add-to-cart-button"
      >
        {addedToCart ? 'Added!' : 'Add to Cart'}
      </button>

      <div className="reviews-section">
        <button onClick={() => setShowReviews(!showReviews)}>
          {showReviews ? 'Hide Reviews' : 'Show Reviews'}
        </button>
        
        {showReviews && (
          <div className="reviews-list">
            {isLoading && <p>Loading reviews...</p>}
            {reviewsError && <p className="error">Error: {reviewsError}</p>}
            {!isLoading && !reviewsError && reviews.length === 0 && (
              <p>No reviews yet</p>
            )}
            {!isLoading && !reviewsError && reviews.map((review) => (
              <div key={review.id} className="review-item">
                <p>{review.text}</p>
                <small>{review.author}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}