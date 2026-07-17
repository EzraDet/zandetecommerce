// src/components/FeatureProduct.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts, useCart } from '../services/api';

const FeatureProduct = () => {
  const { products, loading, error } = useProducts();
  const { addItem, cartItems, refreshCart } = useCart();
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState({});
  const [showAddedMessage, setShowAddedMessage] = useState({});
  const [localCartItems, setLocalCartItems] = useState([]);
  const scrollContainerRef = useRef(null);
  const animationRef = useRef(null);
  const [quickAddSuccess, setQuickAddSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Sync local cart items with global cart items
  useEffect(() => {
    setLocalCartItems(cartItems);
  }, [cartItems]);

  // Get unique products for display
  const getDisplayProducts = useCallback(() => {
    if (!products || products.length === 0) return [];
    return products;
  }, [products]);

  const displayProducts = getDisplayProducts();
  const totalProducts = displayProducts.length;
  const cardWidth = 280; // w-64 = 256px + gap-6 = 24px = 280px

  // Navigate to product detail
  const handleProductClick = useCallback((productId) => {
    navigate(`/product/${productId}`);
  }, [navigate]);

  // Auto-scroll with requestAnimationFrame
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || displayProducts.length === 0) return;

    let scrollAmount = container.scrollLeft;
    const speed = 1.2;

    const animate = () => {
      if (!isPaused) {
        scrollAmount += speed;
        
        // Calculate max scroll
        const maxScroll = (displayProducts.length - 1) * cardWidth;
        
        // Reset to start when reaching the end
        if (scrollAmount >= maxScroll) {
          scrollAmount = 0;
          setCurrentIndex(0);
        }
        
        container.scrollLeft = scrollAmount;
        
        // Update current index based on scroll position
        const newIndex = Math.round(scrollAmount / cardWidth);
        if (newIndex !== currentIndex && newIndex < displayProducts.length) {
          setCurrentIndex(newIndex);
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [displayProducts.length, isPaused, currentIndex, cardWidth]);

  // Pause on hover
  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);

  // Toggle pause/play
  const togglePause = useCallback(() => setIsPaused(prev => !prev), []);

  // Navigate to previous slide
  const handlePrev = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const newIndex = Math.max(0, currentIndex - 1);
    const scrollTo = newIndex * cardWidth;
    container.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    });
    setCurrentIndex(newIndex);
    
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 2000);
  }, [currentIndex, cardWidth]);

  // Navigate to next slide
  const handleNext = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const maxIndex = Math.max(0, displayProducts.length - 1);
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    const scrollTo = newIndex * cardWidth;
    container.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    });
    setCurrentIndex(newIndex);
    
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 2000);
  }, [currentIndex, cardWidth, displayProducts.length]);

  // Go to specific slide
  const goToSlide = useCallback((index) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollTo = index * cardWidth;
    container.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    });
    setCurrentIndex(index);
    
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 2000);
  }, [cardWidth]);

  // Handle scroll events to update current index
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const index = Math.round(container.scrollLeft / cardWidth);
    if (index !== currentIndex && index < displayProducts.length) {
      setCurrentIndex(index);
    }
  }, [currentIndex, cardWidth, displayProducts.length]);

  // Handle add to cart with full functionality
  const handleAddToCart = useCallback(async (e, product) => {
    e.stopPropagation(); // Prevent navigation to product detail
    
    // Check if product is already in cart
    const isInCart = localCartItems.some(item => item.id === product.id);
    if (isInCart) {
      // If already in cart, navigate to cart page
      navigate('/cart');
      return;
    }

    // Set loading state for this product
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    setQuickAddSuccess(false);
    setSelectedProduct(product);
    
    try {
      // Add to cart with quantity 1
      await addItem(product.id, 1);
      
      // Refresh cart to update navbar
      await refreshCart();
      
      // Update local cart items
      setLocalCartItems(prev => [...prev, { id: product.id, quantity: 1 }]);
      
      // Show success message
      setShowAddedMessage(prev => ({ ...prev, [product.id]: true }));
      setQuickAddSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowAddedMessage(prev => ({ ...prev, [product.id]: false }));
        setQuickAddSuccess(false);
        setSelectedProduct(null);
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  }, [addItem, localCartItems, navigate, refreshCart]);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Check if product is in cart
  const isProductInCart = useCallback((productId) => {
    return localCartItems.some(item => item.id === productId);
  }, [localCartItems]);

  // Get product images for display (matching ProductDetail)
  const getProductImage = (productId) => {
    const productImages = {
      1: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
      2: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
      3: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80'
    };
    return productImages[productId] || 'https://via.placeholder.com/400x400?text=Product';
  };

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-r from-gray-50 via-white to-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gradient-to-r from-gray-50 via-white to-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600 py-12">
            Error loading products: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="w-full bg-gradient-to-r from-gray-50 via-white to-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 py-12">
            No products available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-gray-50 via-white to-gray-50 py-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-xs font-mono tracking-widest text-indigo-600 block mb-2">
              FEATURED PRODUCTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
              Trending Now
            </h2>
            <p className="text-gray-500 mt-2">Discover our most popular products</p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePause}
              className="p-2 rounded-full bg-white border border-gray-200 hover:border-indigo-300 transition-colors"
              aria-label={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? (
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Quick Add Success Banner - Matching ProductDetail style */}
        {quickAddSuccess && selectedProduct && (
          <div className="fixed top-24 right-4 z-50 animate-slide-in">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl shadow-lg p-4 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Added to Cart!</p>
                  <p className="text-sm text-gray-600 truncate max-w-[150px]">{selectedProduct.title}</p>
                </div>
                <button
                  onClick={() => navigate('/cart')}
                  className="ml-auto text-sm font-medium text-indigo-600 hover:text-indigo-700 whitespace-nowrap"
                >
                  View Cart →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scrolling Products with Navigation Arrows */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 -ml-4"
            aria-label="Previous products"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 -mr-4"
            aria-label="Next products"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Products Container */}
          <div 
            className="relative overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>
            
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-hidden scroll-smooth px-4"
              onScroll={handleScroll}
            >
              {displayProducts.map((product, index) => {
                const isInCart = isProductInCart(product.id);
                const isAdding = addingToCart[product.id];
                const isAdded = showAddedMessage[product.id];
                const productPrice = product.zandetPrice || formatPrice(product.price * 10);
                const productImage = getProductImage(product.id);

                return (
                  <div
                    key={`${product.id}-${index}`}
                    onClick={() => handleProductClick(product.id)}
                    className="flex-none w-64 bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                  >
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <img
                        src={product.image || productImage}
                        alt={product.title}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
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
                      
                      {/* In Stock Badge */}
                      <div className="absolute bottom-3 left-3 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                        In Stock
                      </div>

                      {/* Rating Badge - Matching ProductDetail */}
                      <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        {product.rating || (4 + Math.random()).toFixed(1)}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-1">
                        {product.category || 'Electronics'}
                      </p>
                      <h3 className="font-semibold text-gray-900 truncate mb-2 group-hover:text-indigo-600 transition-colors">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          {productPrice}
                        </span>
                      </div>
                      
                      {/* Add to Cart Button with States - Matching ProductDetail style */}
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={isAdding}
                        className={`w-full mt-3 font-medium py-2 rounded-lg transition-all duration-200 ${
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
          </div>
        </div>

        {/* Scroll Indicators / Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {displayProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-indigo-600' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* View All Products Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/shop')}
            className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors duration-200"
          >
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FeatureProduct);