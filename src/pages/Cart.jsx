// src/pages/Cart.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart, useProducts, useWishlist } from '../services/api';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    total, 
    itemCount, 
    removeItem, 
    updateQuantity, 
    clearCart,
    addItem,
    loading,
    refreshCart
  } = useCart();
  const { products } = useProducts();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const [recommendations, setRecommendations] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [addingToCart, setAddingToCart] = useState({});
  const [showAddedMessage, setShowAddedMessage] = useState({});

  // Get recommendations
  useEffect(() => {
    if (products && products.length > 0 && cartItems.length > 0) {
      const cartIds = cartItems.map(item => item.id);
      const available = products.filter(p => !cartIds.includes(p.id));
      const shuffled = available.sort(() => Math.random() - 0.5);
      setRecommendations(shuffled.slice(0, 4));
    }
  }, [products, cartItems]);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Handle promo code
  const handlePromoSubmit = (e) => {
    e.preventDefault();
    const code = promoCode.toLowerCase().trim();
    
    const promoCodes = {
      'zandet10': 10,
      'zandet20': 20,
      'zandet25': 25,
      'zandet50': 50,
      'save10': 10,
      'save20': 20,
    };

    if (promoCodes[code]) {
      setDiscount(promoCodes[code]);
      setPromoError('');
      setShowPromoInput(false);
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code. Try ZANDET10, ZANDET20, or SAVE10');
    }
  };

  // Calculate totals with discount
  const subtotal = total;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const discountAmount = (subtotal * discount) / 100;
  const grandTotal = subtotal + shipping - discountAmount;

  // Update quantity
  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      await updateQuantity(id, newQuantity);
      await refreshCart();
    }
  };

  // Remove item
  const handleRemoveItem = async (id) => {
    await removeItem(id);
    await refreshCart();
  };

  // Clear cart
  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
      await refreshCart();
    }
  };

  // Checkout handler - Navigate to checkout page
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout');
  };

  // Remove discount
  const removeDiscount = () => {
    setDiscount(0);
    setPromoCode('');
  };

  // Handle add to cart from recommendations
  const handleAddToCart = useCallback(async (e, product) => {
    e.stopPropagation();
    
    const isInCart = cartItems.some(item => item.id === product.id);
    if (isInCart) {
      navigate('/cart');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    try {
      await addItem(product.id, 1);
      await refreshCart();
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
  }, [addItem, cartItems, navigate, refreshCart]);

  // Handle wishlist toggle
  const handleWishlistToggle = useCallback((e, productId) => {
    e.stopPropagation();
    toggleWishlist(productId);
  }, [toggleWishlist]);

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="text-6xl mb-6">🛒</div>
            <h1 className="text-3xl font-black text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-500 mb-8">
              Looks like you haven't added any items to your cart yet.
              Browse our collection and find something you'll love.
            </p>
            <Link
              to="/shop"
              className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
            >
              Start Shopping
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
              Shopping Cart
            </h1>
            <p className="text-gray-500 mt-1">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Continue Shopping</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="sm:w-24 sm:h-24 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="flex-1">
                          <Link
                            to={`/product/${item.id}`}
                            className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2"
                          >
                            {item.title}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            Unit Price: {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between mt-3 gap-2">
                        {/* Quantity Selector */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity >= 10}
                            aria-label="Increase quantity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-center space-x-3">
                          {/* Wishlist Button */}
                          <button
                            onClick={(e) => handleWishlistToggle(e, item.id)}
                            className={`text-sm transition-colors flex items-center space-x-1 ${
                              isInWishlist(item.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                            }`}
                          >
                            <svg className="w-4 h-4" fill={isInWishlist(item.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{isInWishlist(item.id) ? 'Saved' : 'Save'}</span>
                          </button>
                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-sm text-red-500 hover:text-red-700 transition-colors flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Clear Cart Button */}
            {cartItems.length > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={handleClearCart}
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear Cart</span>
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-28">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 border-b border-gray-100 pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                  <span className="text-gray-900 font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-medium">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Discount ({discount}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4 text-lg font-bold">
                <span>Total</span>
                <span className="text-indigo-600">{formatPrice(grandTotal)}</span>
              </div>

              {/* Promo Code */}
              <div className="mt-4">
                {!showPromoInput ? (
                  <button
                    onClick={() => setShowPromoInput(true)}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                  >
                    + Apply Promo Code
                  </button>
                ) : (
                  <form onSubmit={handlePromoSubmit} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-xs text-red-500">{promoError}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setShowPromoInput(false);
                        setPromoError('');
                        setPromoCode('');
                      }}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>

              {discount > 0 && (
                <button
                  onClick={removeDiscount}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors mt-1"
                >
                  Remove discount
                </button>
              )}

              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                🔒 Secure checkout • Free returns
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recommendations.map((product) => {
                const isInCart = cartItems.some(item => item.id === product.id);
                const isAdding = addingToCart[product.id];
                const isAdded = showAddedMessage[product.id];
                const isWishlisted = isInWishlist(product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group"
                  >
                    <div className="aspect-square bg-gray-50 p-4 relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={(e) => handleWishlistToggle(e, product.id)}
                        className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all"
                      >
                        <svg className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {product.title}
                      </h3>
                      <p className="text-lg font-bold text-indigo-600 mt-1">
                        {formatPrice(product.price * 10)}
                      </p>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={isAdding}
                        className={`w-full mt-2 py-1 text-sm font-medium rounded-lg transition-all ${
                          isInCart
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : isAdded
                            ? 'bg-green-500 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        } disabled:opacity-70 disabled:cursor-not-allowed`}
                      >
                        {isAdding ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Cart);