import React, { useState, useEffect } from 'react';

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quantity: 1,
      addedToCart: false,
      reviews: [], // Pas de typage
      showReviews: false,
      isEditing: false
    };
  }

  async fetchReviews() {
    try {
      const response = await fetch(`http://api.example.com/products/${this.props.product.id}/reviews`);
      const data = await response.json();
      this.setState({ reviews: data });
    } catch (e) {
      console.log('Error fetching reviews:', e);
    }
  }

  handleAddToCart = () => {
    document.getElementById('cart-count').innerHTML = this.state.quantity;
    
    fetch('http://api.example.com/cart', {
      method: 'POST',
      body: JSON.stringify({
          productId: this.props.product.id,
          quantity: this.state.quantity
      })
    });

    this.setState({ addedToCart: true });
    
    // Pourquoi un setTimeout ?
    setTimeout(() => {
      this.setState({ addedToCart: false });
    }, 3000);
  }

  updateQuantity(increment) {
    let newQuantity = this.state.quantity + increment;
    
    if (newQuantity > this.props.product.stock) {
      alert('Not enough stock!');
      return;
    }
    
    if (newQuantity < 1) newQuantity = 1;
    
    this.setState({ quantity: newQuantity });
    
    window.dispatchEvent(new CustomEvent('quantityChanged', { 
      detail: { quantity: newQuantity }
    }));

  }

  render() {
    const { product } = this.props;
    if (!product) return null;

    return (
      <div style={{ padding: '20px' }}>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        
        <div className="quantity-selector">
          <button onClick={() => this.updateQuantity(-1)}>-</button>
          <span>{this.state.quantity}</span>
          <button onClick={() => this.updateQuantity(1)}>+</button>
        </div>

        <button 
          onClick={this.handleAddToCart}
          disabled={this.state.addedToCart}
        >
          {this.state.addedToCart ? 'Added!' : 'Add to Cart'}
        </button>

        {this.state.showReviews && this.state.reviews.length > 0 ? (
          this.state.reviews.map((review, index) => (
            <div key={index}>
              <p>{review.text}</p>
              <small>{review.author}</small>
            </div>
          ))
        ) : this.state.showReviews ? (
          <p>No reviews yet</p>
        ) : null}
      </div>
    );
  }
}

export default ProductDetails; 