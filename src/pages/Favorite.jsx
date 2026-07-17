// src/pages/Favorite.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWishlist, useCart, useProducts } from '../services/api';

const Favorite = () => {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, isInWishlist, loading: wishlistLoading } = useWishlist();
  const { addItem, cartItems } = useCart();
  const { products } = useProducts();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState({});
  const [showAddedMessage, setShowAddedMessage] = useState({});

  // Get full product details for wishlist items
  useEffect(() => {
    if (products && products.length > 0 && wishlist.length > 0) {
      const items = products.filter(product => wishlist.includes(product.id));
      setWishlistProducts(items);
    } else {
      setWishlistProducts([]);
    }
  }, [products, wishlist]);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Handle add to cart
  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    
    // Check if already in cart
    const isInCart = cartItems.some(item => item.id === product.id);
    if (isInCart) {
      navigate('/cart');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    try {
      await addItem(product.id, 1);
      setShowAddedMessage(prev => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setShowAddedMessage(prev => ({ ...prev, [product.id]: false }));
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  // Handle remove from wishlist
  const handleRemoveFromWishlist = (e, productId) => {
    e.stopPropagation();
    toggleWishlist(productId);
  };

  // Handle move all to cart
  const handleMoveAllToCart = async () => {
    if (wishlistProducts.length === 0) return;
    
    let successCount = 0;
    for (const product of wishlistProducts) {
      try {
        await addItem(product.id, 1);
        successCount++;
      } catch (error) {
        console.error(`Error adding ${product.title}:`, error);
      }
    }
    
    if (successCount === wishlistProducts.length) {
      // Clear wishlist after adding all items
      wishlistProducts.forEach(product => {
        toggleWishlist(product.id);
      });
      alert(`Successfully added all ${successCount} items to cart!`);
    } else {
      alert(`Added ${successCount} out of ${wishlistProducts.length} items to cart.`);
    }
  };

  if (wishlistLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-500">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty wishlist
  if (wishlist.length === 0 || wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="text-6xl mb-6">❤️</div>
            <h1 className="text-3xl font-black text-gray-900 mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-500 mb-8">
              Start saving your favorite items by clicking the heart icon on any product.
              Build your dream collection today!
            </p>
            <Link
              to="/shop"
              className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
            >
              Browse Products
            </Link>
            
            {/* Popular Categories */}
            <div className="mt-12">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Popular Categories</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['Electronics', 'Audio', 'Wearables', 'Computing'].map((cat) => (
                  <Link
                    key={cat}
                    to={`/shop?category=${cat.toLowerCase()}`}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
              My Wishlist
            </h1>
            <p className="text-gray-500 mt-1">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/shop')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Browse More</span>
            </button>
            {wishlistProducts.length > 0 && (
              <button
                onClick={handleMoveAllToCart}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Move All to Cart
              </button>
            )}
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => {
            const isInCart = cartItems.some(item => item.id === product.id);
            const isAdding = addingToCart[product.id];
            const isAdded = showAddedMessage[product.id];
            const productPrice = product.zandetPrice || formatPrice(product.price * 10);

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200"
              >
                {/* Image */}
                <div 
                  className="relative aspect-square bg-gray-50 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Badges */}
                  {product.isNew && (
                    <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      NEW
                    </span>
                  )}
                  {product.isSale && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      SALE
                    </span>
                  )}

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      Quick View
                    </span>
                  </div>

                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={(e) => handleRemoveFromWishlist(e, product.id)}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-red-50 group/remove"
                    aria-label="Remove from wishlist"
                  >
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <p className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-1">
                    {product.category || 'Electronics'}
                  </p>
                  <h3 
                    className="font-semibold text-gray-900 truncate cursor-pointer hover:text-indigo-600 transition-colors"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xl font-bold text-gray-900">
                      {productPrice}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600">
                        {product.rating || (4 + Math.random()).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={isAdding}
                    className={`w-full mt-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                      isInCart
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : isAdded
                        ? 'bg-green-500 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    } disabled:opacity-70 disabled:cursor-not-allowed`}
                  >
                    {isAdding ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </span>
                    ) : isInCart ? (
                      'Go to Cart'
                    ) : isAdded ? (
                      '✓ Added!'
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Wishlist Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-indigo-600">{wishlistProducts.length}</p>
            <p className="text-xs text-gray-500">Items Saved</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-indigo-600">
              {wishlistProducts.reduce((sum, p) => sum + (p.price * 10), 0).toFixed(0)}
            </p>
            <p className="text-xs text-gray-500">Total Value</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-indigo-600">
              {wishlistProducts.filter(p => p.isSale).length}
            </p>
            <p className="text-xs text-gray-500">Items on Sale</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-indigo-600">
              {wishlistProducts.filter(p => p.isNew).length}
            </p>
            <p className="text-xs text-gray-500">New Arrivals</p>
          </div>
        </div>

        {/* Share Wishlist */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 text-center">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Share Your Wishlist</h3>
          <div className="flex justify-center space-x-4">
            <button className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </button>
            <button className="p-2 bg-red-50 rounded-full hover:bg-red-100 transition-colors">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </button>
            <button className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.521 8.521 0 01-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Favorite);