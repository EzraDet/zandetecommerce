// src/components/Navbar.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart, useWishlist } from '../services/api';
import SearchDropdown from './SearchDropdown';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'shop', label: 'Shop', href: '/shop' },
  { id: 'product', label: 'Product', href: '/products' },
  { id: 'about', label: 'About', href: '/about' },
  { id: 'contact', label: 'Contact', href: '/contact' },
];

// Icon Components
const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const HeartIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const CartIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ProfileIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CloseIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MenuIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

// Cart Counter with Auto-Refresh
const CartCounter = ({ cartItems, refreshTrigger }) => {
  const [count, setCount] = useState(0);
  const [animate, setAnimate] = useState(false);
  const prevCountRef = React.useRef(0);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (total !== prevCountRef.current) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
    }
    setCount(total);
    prevCountRef.current = total;
  }, [cartItems, refreshTrigger]);

  if (count === 0) return null;

  return (
    <span className={`absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center transition-all duration-300 ${animate ? 'scale-125' : 'scale-100'}`}>
      {count > 99 ? '99+' : count}
    </span>
  );
};

// Wishlist Counter with Auto-Refresh
const WishlistCounter = ({ wishlist, refreshTrigger }) => {
  const [count, setCount] = useState(0);
  const [animate, setAnimate] = useState(false);
  const prevCountRef = React.useRef(0);

  useEffect(() => {
    const total = wishlist.length;
    if (total !== prevCountRef.current) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
    }
    setCount(total);
    prevCountRef.current = total;
  }, [wishlist, refreshTrigger]);

  if (count === 0) return null;

  return (
    <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center transition-all duration-300 ${animate ? 'scale-125' : 'scale-100'}`}>
      {count}
    </span>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, refreshTrigger: cartRefreshTrigger } = useCart();
  const { wishlist, refreshTrigger: wishlistRefreshTrigger } = useWishlist();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLink, setActiveLink] = useState('home');

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems, cartRefreshTrigger]);

  const wishlistCount = useMemo(() => {
    return wishlist.length;
  }, [wishlist, wishlistRefreshTrigger]);

  // Update active link based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = NAV_ITEMS.find(item => item.href === currentPath);
    if (activeItem) {
      setActiveLink(activeItem.id);
    } else if (currentPath === '/') {
      setActiveLink('home');
    } else if (currentPath.startsWith('/product/')) {
      setActiveLink('product');
    } else if (currentPath.startsWith('/products')) {
      setActiveLink('product');
    } else if (currentPath === '/wishlist') {
      setActiveLink('wishlist');
    } else if (currentPath === '/cart') {
      setActiveLink('cart');
    }
  }, [location.pathname]);

  // Prevent body scroll when mobile menu or search is open
  useEffect(() => {
    if (isSearchOpen || isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen, isOpen]);

  // Keyboard shortcuts - Close search with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery('');
        document.getElementById('search-toggle')?.focus();
      }
    };

    if (isSearchOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isSearchOpen]);

  // Handle search submit
  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery, navigate]);

  // Handle navigation item click
  const handleNavClick = useCallback((id, href) => {
    setActiveLink(id);
    setIsOpen(false);
    navigate(href);
  }, [navigate]);

  // Handle logo click - navigate to home
  const handleLogoClick = useCallback(() => {
    navigate('/');
    setActiveLink('home');
    setIsOpen(false);
    setIsSearchOpen(false);
  }, [navigate]);

  return (
    <nav className="fixed w-full z-50 top-0 start-0 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 1. Logo - Clickable to Home */}
          <div 
            onClick={handleLogoClick}
            className="flex-shrink-0 flex items-center cursor-pointer group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleLogoClick()}
            aria-label="Go to homepage"
          >
            <span className="text-2xl font-black tracking-widest text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
              ZANDET
              <span className="text-indigo-600 group-hover:text-indigo-700 transition-colors">.</span>
            </span>
          </div>

          {/* 2. Main Navigation (Hidden on Mobile) */}
          <div className="hidden md:flex space-x-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.href)}
                className={`font-medium text-sm transition-colors ${
                  activeLink === item.id
                    ? 'text-indigo-600'
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 3. Utility Icons */}
          <div className="flex items-center space-x-5">
            {/* Functional Search Toggle */}
            <button
              id="search-toggle"
              onClick={() => {
                setIsSearchOpen(true);
                setIsOpen(false);
              }}
              aria-label="Open Search"
              className="text-gray-500 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
            >
              <SearchIcon />
            </button>

            {/* Favorite with Auto-Refresh Badge */}
            <button
              aria-label="Wishlist"
              className="text-gray-500 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1 relative"
              onClick={() => navigate('/wishlist')}
            >
              <HeartIcon />
              <WishlistCounter 
                wishlist={wishlist} 
                refreshTrigger={wishlistRefreshTrigger} 
              />
            </button>

            {/* Cart with Auto-Refresh Badge */}
            <button
              aria-label="Cart"
              className="text-gray-500 hover:text-indigo-600 transition-colors relative focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
              onClick={() => navigate('/cart')}
            >
              <CartIcon />
              <CartCounter 
                cartItems={cartItems} 
                refreshTrigger={cartRefreshTrigger} 
              />
            </button>

            {/* Profile */}
            <button
              aria-label="Profile"
              className="text-gray-500 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
              onClick={() => navigate('/profile')}
            >
              <ProfileIcon />
            </button>

            {/* Functional Mobile Menu Button */}
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                setIsSearchOpen(false);
              }}
              className="md:hidden ml-2 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1 transition-colors"
              aria-label={isOpen ? "Close Navigation Menu" : "Toggle Navigation Menu"}
            >
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Modern Expandable Search Overlay with Dropdown - FIXED */}
      <div
        className={`absolute inset-0 bg-white/98 backdrop-blur-sm z-20 transition-all duration-300 ease-in-out ${
          isSearchOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-label="Search"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex items-start pt-24">
          <div className="w-full relative">
            {/* Search Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Search Products</h2>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="text-gray-400 hover:text-gray-900 transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
                aria-label="Close Search"
              >
                <CloseIcon className="w-8 h-8" />
              </button>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex items-center gap-4 bg-white rounded-2xl border-2 border-indigo-600/20 focus-within:border-indigo-600 shadow-lg p-2 transition-all">
                <SearchIcon className="w-6 h-6 text-indigo-600 flex-shrink-0 ml-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search premium electronics, audio, smart devices..."
                  className="w-full bg-transparent text-gray-900 text-lg py-4 focus:outline-none placeholder-gray-400"
                  autoFocus={isSearchOpen}
                  aria-label="Search input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <CloseIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>

            {/* Search Dropdown */}
            <SearchDropdown
              isOpen={isSearchOpen && searchQuery.length > 0}
              onClose={() => {
                if (!searchQuery) {
                  setIsSearchOpen(false);
                }
              }}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>
      </div>

      {/* 5. Mobile Dropdown Menu Container */}
      <div
        className={`md:hidden bg-white border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen
            ? 'max-h-[400px] opacity-100'
            : 'max-h-0 opacity-0 pointer-events-none'
        }`}
        role="navigation"
        aria-label="Mobile Navigation"
      >
        <div className="px-4 pt-3 pb-6 space-y-2 shadow-inner">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, item.href)}
              className={`block w-full text-left py-2.5 px-3 rounded-lg font-medium text-base transition-all ${
                activeLink === item.id
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          <div className="border-t border-gray-100 my-3"></div>
          
          <button
            onClick={() => {
              navigate('/wishlist');
              setIsOpen(false);
            }}
            className="block w-full text-left py-2.5 px-3 rounded-lg font-medium text-base text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-all flex items-center justify-between"
          >
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full transition-all duration-300">
                {wishlistCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              navigate('/cart');
              setIsOpen(false);
            }}
            className="block w-full text-left py-2.5 px-3 rounded-lg font-medium text-base text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-all flex items-center justify-between"
          >
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full transition-all duration-300">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);