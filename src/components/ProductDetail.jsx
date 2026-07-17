// src/components/ProductDetail.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct, useCart, useWishlist } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error, relatedProducts } = useProduct(id);
  const { addItem, cartItems, refreshCart } = useCart();
  const { toggleWishlist, isInWishlist, refreshWishlist } = useWishlist();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  // Auto-scroll to top when product changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    const productContainer = document.getElementById('product-detail-container');
    if (productContainer) {
      productContainer.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    setSelectedImage(0);
    setQuantity(1);
    setActiveTab('description');
    setIsAddingToCart(false);
    setShowAddedMessage(false);
  }, [id]);

  // Format price function
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Get product price
  const getProductPrice = () => {
    if (!product) return '$0.00';
    return product.zandetPrice || formatPrice(product.price * 10);
  };

  const productPrice = getProductPrice();

  // Set default image when product loads
  useEffect(() => {
    if (product) {
      setSelectedImage(0);
    }
  }, [product]);

  // Check if product is in cart
  const isInCart = cartItems.some(item => item.id === parseInt(id));

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < 10) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Add to cart handler with auto-refresh
  const handleAddToCart = async () => {
    if (isInCart) {
      navigate('/cart');
      return;
    }

    try {
      setIsAddingToCart(true);
      await addItem(parseInt(id), quantity);
      await refreshCart(); // Refresh cart to update navbar
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Buy now handler
  const handleBuyNow = async () => {
    try {
      await addItem(parseInt(id), quantity);
      await refreshCart(); // Refresh cart to update navbar
      navigate('/checkout');
    } catch (error) {
      console.error('Error buying now:', error);
    }
  };

  // Wishlist toggle handler with auto-refresh
  const handleToggleWishlist = useCallback(async () => {
    toggleWishlist(parseInt(id));
    await refreshWishlist(); // Refresh wishlist to update navbar
  }, [id, toggleWishlist, refreshWishlist]);

  // Get rating value (handle both formats)
  const getRating = () => {
    if (!product) return 0;
    if (product.rating && typeof product.rating === 'object' && product.rating.rate) {
      return parseFloat(product.rating.rate);
    }
    if (typeof product.rating === 'number') {
      return product.rating;
    }
    return 4.5;
  };

  // Get review count
  const getReviewCount = () => {
    if (!product) return 0;
    if (product.rating && typeof product.rating === 'object' && product.rating.count) {
      return product.rating.count;
    }
    return product.reviews || Math.floor(Math.random() * 100) + 10;
  };

  // Generate rating stars
  const renderStars = (rating) => {
    const numRating = typeof rating === 'number' ? rating : parseFloat(rating);
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`star-${i}`} className="text-yellow-400">★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half-star" className="text-yellow-400">★</span>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">★</span>
      );
    }

    return stars;
  };

  // Generate features data based on product category
  const getFeatures = () => {
    if (!product) return [];
    
    const category = product.category?.toLowerCase() || '';
    const features = [];

    features.push(
      { icon: '🔋', label: 'Battery Life', value: 'Up to 24 hours' },
      { icon: '📦', label: 'Weight', value: '0.5 kg' },
      { icon: '📐', label: 'Dimensions', value: '15.6 x 8.2 x 0.8 inches' },
    );

    if (category.includes('electronics') || category.includes('audio')) {
      features.push(
        { icon: '🎵', label: 'Audio Quality', value: 'Hi-Fi Stereo' },
        { icon: '🔊', label: 'Sound Output', value: '40W RMS' },
        { icon: '📡', label: 'Connectivity', value: 'Bluetooth 5.0' },
      );
    } else if (category.includes('watch') || category.includes('wearable')) {
      features.push(
        { icon: '⌚', label: 'Display', value: 'AMOLED 1.4"' },
        { icon: '💧', label: 'Water Resistance', value: '5ATM' },
        { icon: '📱', label: 'Compatibility', value: 'iOS & Android' },
      );
    } else if (category.includes('laptop') || category.includes('computer')) {
      features.push(
        { icon: '💻', label: 'Processor', value: 'Intel Core i7' },
        { icon: '🧠', label: 'Memory', value: '16GB DDR5' },
        { icon: '💾', label: 'Storage', value: '512GB SSD' },
      );
    } else {
      features.push(
        { icon: '⚡', label: 'Performance', value: 'High Speed' },
        { icon: '🔒', label: 'Security', value: 'Advanced Protection' },
        { icon: '🌐', label: 'Connectivity', value: 'Wi-Fi 6' },
      );
    }

    return features;
  };

  // Generate tech specs based on product category
  const getTechSpecs = () => {
    if (!product) return [];
    
    const category = product.category?.toLowerCase() || '';
    const specs = [];

    specs.push(
      { label: 'Model', value: product.title?.substring(0, 20) || 'ZANDET Pro' },
      { label: 'Brand', value: 'ZANDET' },
      { label: 'Price', value: productPrice },
      { label: 'Category', value: product.category || 'Electronics' },
    );

    if (category.includes('electronics') || category.includes('audio')) {
      specs.push(
        { label: 'Driver Size', value: '40mm' },
        { label: 'Frequency Response', value: '20Hz - 20kHz' },
        { label: 'Impedance', value: '32Ω' },
        { label: 'Battery Life', value: '24 hours' },
        { label: 'Charging Time', value: '2 hours' },
        { label: 'Wireless Range', value: '10m' },
      );
    } else if (category.includes('watch') || category.includes('wearable')) {
      specs.push(
        { label: 'Display Type', value: 'AMOLED' },
        { label: 'Screen Size', value: '1.4 inches' },
        { label: 'Resolution', value: '454 x 454 pixels' },
        { label: 'Battery', value: '450mAh' },
        { label: 'Water Resistance', value: '5ATM' },
        { label: 'GPS', value: 'Built-in' },
      );
    } else if (category.includes('laptop') || category.includes('computer')) {
      specs.push(
        { label: 'Processor', value: 'Intel Core i7-1260P' },
        { label: 'RAM', value: '16GB LPDDR5' },
        { label: 'Storage', value: '512GB NVMe SSD' },
        { label: 'Display', value: '14" 2.8K OLED' },
        { label: 'Graphics', value: 'Intel Iris Xe' },
        { label: 'Battery', value: '56Wh' },
      );
    } else {
      specs.push(
        { label: 'Processor', value: 'High-Performance Chip' },
        { label: 'Memory', value: '8GB / 16GB' },
        { label: 'Storage', value: '256GB / 512GB' },
        { label: 'Display', value: 'HD / 4K' },
        { label: 'Battery', value: 'Long-lasting' },
        { label: 'Connectivity', value: 'Wi-Fi, Bluetooth' },
      );
    }

    return specs;
  };

  const features = getFeatures();
  const techSpecs = getTechSpecs();
  const ratingValue = getRating();
  const reviewCount = getReviewCount();

  // Loading state
  if (loading) {
    return (
      <div id="product-detail-container" className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-500">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div id="product-detail-container" className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div id="product-detail-container" className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500">Product not found</p>
          </div>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(parseInt(id));

  return (
    <div id="product-detail-container" className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-indigo-600 transition-colors">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('/shop')} className="hover:text-indigo-600 transition-colors">
            Shop
          </button>
          <span>/</span>
          <span className="text-gray-900">{product.title?.substring(0, 30)}...</span>
        </nav>

        {/* Back to Shop Button */}
        <button
          onClick={() => navigate('/shop')}
          className="flex items-center space-x-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Shop</span>
        </button>

        {/* Product Detail Main */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
            {/* Left Column - Images */}
            <div>
              {/* Main Image */}
              <div className="relative bg-gray-50 rounded-xl overflow-hidden aspect-square">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain p-8"
                />
                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    NEW
                  </span>
                )}
                {product.isSale && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    SALE
                  </span>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3 mt-4">
                {[product.image, product.image, product.image, product.image].map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-indigo-600 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-contain p-2 bg-gray-50"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="flex flex-col">
              {/* Category */}
              <span className="text-xs font-mono tracking-widest text-indigo-600 uppercase">
                {product.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mt-2">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-3 mt-2">
                <div className="flex items-center space-x-1">
                  {renderStars(ratingValue)}
                </div>
                <span className="text-sm text-gray-500">
                  {ratingValue.toFixed(1)} ({reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  {productPrice}
                </span>
                {product.isSale && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.price * 15)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${
                    isInCart
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isAddingToCart ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </span>
                  ) : isInCart ? (
                    'Go to Cart'
                  ) : (
                    'Add to Cart'
                  )}
                </button>
                
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-all"
                >
                  Buy Now
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className="px-4 py-3 border border-gray-200 hover:border-indigo-300 rounded-xl transition-all"
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {isWishlisted ? (
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-gray-400 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Added to Cart Message */}
              {showAddedMessage && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm animate-fade-in">
                  ✓ Product added to cart successfully!
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-6 flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={decrementQuantity}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max="10"
                    className="w-14 text-center border-0 focus:outline-none"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= 10}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Product Tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  Free Shipping
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  In Stock
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  Premium
                </span>
              </div>
            </div>
          </div>

          {/* Tabs Section - Features, Tech Specs, Description */}
          <div className="border-t border-gray-200 px-6 lg:px-10 pb-10">
            {/* Tab Navigation */}
            <div className="flex space-x-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'description'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'features'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Features
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'specs'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tech Specs
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {/* Description Tab */}
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-600">Premium quality materials used</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-600">Advanced technology integration</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-600">Designed for durability</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-600">Eco-friendly packaging</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                        <span className="text-2xl">{feature.icon}</span>
                        <div>
                          <p className="text-sm text-gray-500">{feature.label}</p>
                          <p className="font-semibold text-gray-900">{feature.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">Why Choose ZANDET?</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Premium build quality with attention to detail</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Innovative technology for superior performance</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>24/7 customer support and warranty</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Tech Specs Tab */}
              {activeTab === 'specs' && (
                <div>
                  <div className="bg-gray-50 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {techSpecs.map((spec, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-700 w-1/3 border-b border-gray-100">
                              {spec.label}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 w-2/3 border-b border-gray-100">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-blue-800">
                          <span className="font-semibold">Note:</span> Specifications may vary. Please check the product packaging for the most accurate information.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
                >
                  <div className="aspect-square bg-gray-50 p-4">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {relatedProduct.title}
                    </h4>
                    <p className="text-lg font-bold text-indigo-600 mt-1">
                      {formatPrice(relatedProduct.price * 10)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ProductDetail);