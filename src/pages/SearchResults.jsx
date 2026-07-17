// src/pages/SearchResults.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSearch, useProducts } from '../services/api';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const { results, loading, error } = useSearch(query);
  const { products: allProducts } = useProducts();
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Generate suggestions based on search query
  useEffect(() => {
    if (!query || query.length < 2 || !allProducts || allProducts.length === 0) {
      setSuggestions([]);
      return;
    }

    const generateSuggestions = () => {
      const queryLower = query.toLowerCase();
      const matched = allProducts
        .filter(product => 
          product.title.toLowerCase().includes(queryLower) ||
          product.category.toLowerCase().includes(queryLower) ||
          product.description.toLowerCase().includes(queryLower)
        )
        .slice(0, 6)
        .map(product => ({
          id: product.id,
          title: product.title,
          category: product.category,
          image: product.image,
          price: product.price
        }));

      // If no exact matches, provide category-based suggestions
      if (matched.length === 0) {
        const categorySuggestions = allProducts
          .filter(product => 
            product.category.toLowerCase().includes(queryLower) ||
            product.category.toLowerCase().includes(queryLower.split(' ')[0])
          )
          .slice(0, 4)
          .map(product => ({
            id: product.id,
            title: product.title,
            category: product.category,
            image: product.image,
            price: product.price
          }));
        setSuggestions(categorySuggestions);
      } else {
        setSuggestions(matched);
      }
    };

    generateSuggestions();
  }, [query, allProducts]);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Get popular search terms
  const popularSearches = [
    'Headphones',
    'Smart Watch',
    'Laptop',
    'Bluetooth Speaker',
    'Camera',
    'Gaming Console',
    'Tablet',
    'Smartphone'
  ];

  // Get categories for browsing
  const categories = [
    { name: 'Electronics', icon: '💻' },
    { name: 'Wearables', icon: '⌚' },
    { name: 'Audio', icon: '🎧' },
    { name: 'Computing', icon: '🖥️' },
    { name: 'Accessories', icon: '🔌' },
    { name: 'Gaming', icon: '🎮' },
  ];

  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setShowSuggestions(false);
  };

  const handlePopularSearch = (term) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-500">Searching for "{query}"...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              {query ? `Results for "${query}"` : 'Search Products'}
            </h1>
            {query && (
              <p className="text-gray-500 mt-2">
                Found {results.length} {results.length === 1 ? 'product' : 'products'}
              </p>
            )}
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Browse All Products →
          </button>
        </div>
      </div>

      {/* Suggestions Section */}
      {suggestions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <span className="mr-2">💡</span>
            Suggestions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSuggestionClick(product.id)}
                className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 hover:border-indigo-200"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-12 h-12 object-contain rounded-lg bg-gray-50 p-1"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.title}
                  </p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                  <p className="text-sm font-bold text-indigo-600">
                    {formatPrice(product.price * 10)}
                  </p>
                </div>
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Searches (when no query or no results) */}
      {(!query || results.length === 0) && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            🔥 Popular Searches
          </h2>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => handlePopularSearch(term)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Categories (when no query) */}
      {!query && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            📂 Browse Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => navigate(`/search?q=${encodeURIComponent(category.name)}`)}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-indigo-200"
              >
                <span className="text-3xl">{category.icon}</span>
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {query && results.length === 0 && suggestions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            We couldn't find any products matching "{query}". Try adjusting your search terms or browse our categories.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {popularSearches.slice(0, 4).map((term) => (
              <button
                key={term}
                onClick={() => handlePopularSearch(term)}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-full text-sm transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Grid */}
      {query && results.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            📦 All Results
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
              >
                <div className="aspect-square bg-gray-50 p-4 relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
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
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-1">
                    {product.category || 'Electronics'}
                  </p>
                  <h3 className="font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price * 10)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600">
                        {product.rating?.rate || (4 + Math.random()).toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Added ${product.title} to cart!`);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;