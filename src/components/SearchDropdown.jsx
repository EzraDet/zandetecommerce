// src/components/SearchDropdown.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../services/api';

const SearchDropdown = ({ 
  isOpen, 
  onClose, 
  searchQuery, 
  setSearchQuery,
  placeholder = "Search premium electronics, audio, smart devices..."
}) => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [suggestions, setSuggestions] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  const dropdownRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('zandet_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim() || !products) {
      setFilteredProducts([]);
      setSuggestions([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    
    // Filter products
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );

    setFilteredProducts(filtered.slice(0, 10)); // Show max 10 products

    // Generate category suggestions
    const categoryMatches = [...new Set(
      products
        .filter(p => p.category.toLowerCase().includes(query))
        .map(p => p.category)
    )].slice(0, 3);

    setSuggestions(categoryMatches);
    setSelectedIndex(-1);
  }, [searchQuery, products]);

  // Save search to recent
  const saveRecentSearch = useCallback((query) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('zandet_recent_searches', JSON.stringify(updated));
  }, [recentSearches]);

  // Handle search submit
  const handleSearch = useCallback((query) => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
      setSearchQuery('');
    }
  }, [navigate, onClose, setSearchQuery, saveRecentSearch]);

  // Handle product click
  const handleProductClick = useCallback((productId) => {
    navigate(`/product/${productId}`);
    onClose();
    setSearchQuery('');
  }, [navigate, onClose, setSearchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    const totalItems = filteredProducts.length + suggestions.length;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % totalItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredProducts.length) {
        handleProductClick(filteredProducts[selectedIndex].id);
      } else if (selectedIndex >= filteredProducts.length && selectedIndex < totalItems) {
        const suggestionIndex = selectedIndex - filteredProducts.length;
        if (suggestions[suggestionIndex]) {
          handleSearch(suggestions[suggestionIndex]);
        }
      } else if (searchQuery.trim()) {
        handleSearch(searchQuery);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [filteredProducts, suggestions, selectedIndex, handleProductClick, handleSearch, searchQuery, onClose]);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('zandet_recent_searches');
  }, []);

  if (!isOpen) return null;

  const hasResults = filteredProducts.length > 0 || suggestions.length > 0 || recentSearches.length > 0;
  const totalItems = filteredProducts.length + suggestions.length;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
      onKeyDown={handleKeyDown}
    >
      {loading && (
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-xs text-gray-500 mt-2">Loading products...</p>
        </div>
      )}

      {!loading && !hasResults && searchQuery.trim() && (
        <div className="p-6 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-600 font-medium">No results found for "{searchQuery}"</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search terms</p>
        </div>
      )}

      {!loading && !searchQuery.trim() && recentSearches.length > 0 && (
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Searches</span>
            <button
              onClick={clearRecentSearches}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleSearch(search)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors flex items-center space-x-1"
              >
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{search}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Suggestions */}
      {suggestions.length > 0 && (
        <div className="p-3 border-b border-gray-100">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Categories</span>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((category, index) => {
              const globalIndex = filteredProducts.length + index;
              return (
                <button
                  key={category}
                  onClick={() => handleSearch(category)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedIndex === globalIndex
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Product Results */}
      {filteredProducts.length > 0 && (
        <div className="p-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block px-2 py-1">
            Products ({filteredProducts.length})
          </span>
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${
                selectedIndex === index
                  ? 'bg-indigo-50 border border-indigo-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm truncate ${
                  selectedIndex === index ? 'text-indigo-600' : 'text-gray-900'
                }`}>
                  {product.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500">{product.category}</span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-sm font-bold text-indigo-600">
                    {formatPrice(product.price * 10)}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  selectedIndex === index
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  View
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search All Button */}
      {searchQuery.trim() && (
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => handleSearch(searchQuery)}
            className="w-full py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>View all results for "{searchQuery}"</span>
          </button>
        </div>
      )}

      {/* Keyboard hints */}
      <div className="p-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-center gap-4">
        <span>⌨️ Arrow keys to navigate</span>
        <span>•</span>
        <span>↵ Enter to select</span>
        <span>•</span>
        <span>⎋ Esc to close</span>
      </div>
    </div>
  );
};

export default React.memo(SearchDropdown);