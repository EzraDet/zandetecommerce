// src/hooks/useApi.js

import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

// ===================== BASE API HOOK =====================

/**
 * Generic API hook with caching, retry, and debounce capabilities
 */
export const useApi = (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    immediate = true,
    cacheKey = null,
    retryCount = 0,
    retryDelay = 1000,
    debounceDelay = 0,
    onSuccess = null,
    onError = null,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusCode, setStatusCode] = useState(null);
  
  const cache = useRef(new Map());
  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Cache management
  const getCacheKey = () => {
    return cacheKey || `${method}:${endpoint}:${JSON.stringify(body)}`;
  };

  const getFromCache = () => {
    if (!cacheKey) return null;
    const key = getCacheKey();
    const cached = cache.current.get(key);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutes cache
      return cached.data;
    }
    return null;
  };

  const setToCache = (data) => {
    if (!cacheKey) return;
    const key = getCacheKey();
    cache.current.set(key, { data, timestamp: Date.now() });
  };

  // Execute API call
  const execute = useCallback(async (overrideOptions = {}) => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear any pending debounce
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check cache
    const cachedData = getFromCache();
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      setError(null);
      return cachedData;
    }

    return new Promise((resolve, reject) => {
      const executeRequest = async (retryAttempt = 0) => {
        try {
          setLoading(true);
          setError(null);

          // Create abort controller
          abortControllerRef.current = new AbortController();

          // Prepare request
          const requestOptions = {
            method: method || 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(overrideOptions.headers || {}),
            },
            signal: abortControllerRef.current.signal,
          };

          if (body || overrideOptions.body) {
            requestOptions.body = JSON.stringify(overrideOptions.body || body);
          }

          // Make request
          const response = await fetch(
            `${api.API_CONFIG?.baseURL || 'https://fakestoreapi.com'}${endpoint}`,
            requestOptions
          );

          setStatusCode(response.status);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          // Cache result
          setToCache(result);
          setData(result);
          setLoading(false);
          setError(null);

          if (onSuccess) onSuccess(result);
          resolve(result);
          return result;

        } catch (err) {
          // Handle abort errors
          if (err.name === 'AbortError') {
            setLoading(false);
            reject(err);
            return;
          }

          // Retry logic
          if (retryAttempt < retryCount) {
            setTimeout(() => {
              executeRequest(retryAttempt + 1);
            }, retryDelay * (retryAttempt + 1));
            return;
          }

          setError(err.message);
          setLoading(false);
          setStatusCode(err.status || 500);

          if (onError) onError(err);
          reject(err);
        }
      };

      // Debounce logic
      if (debounceDelay > 0) {
        timeoutRef.current = setTimeout(() => {
          executeRequest(0);
        }, debounceDelay);
      } else {
        executeRequest(0);
      }
    });
  }, [endpoint, method, body, retryCount, retryDelay, debounceDelay, onSuccess, onError]);

  // Reset state
  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setStatusCode(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    if (cacheKey) {
      const key = getCacheKey();
      cache.current.delete(key);
    } else {
      cache.current.clear();
    }
  }, [cacheKey]);

  // Immediate execution
  useEffect(() => {
    if (immediate) {
      execute();
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    statusCode,
    execute,
    reset,
    clearCache,
    isCached: cacheKey ? cache.current.has(getCacheKey()) : false,
  };
};

// ===================== PRODUCT HOOKS =====================

/**
 * Hook for fetching all products
 */
export const useProducts = (options = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (params.category) {
        data = await api.productAPI.getByCategory(params.category);
      } else if (params.search) {
        data = await api.productAPI.search(params.search);
      } else if (params.limit) {
        data = await api.productAPI.getLimited(params.limit);
      } else {
        data = await api.zandetAPI.getAllProducts();
      }
      
      setProducts(data);
      setTotalProducts(data.length);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchProducts(options);
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    totalProducts,
    refetch: fetchProducts,
  };
};

/**
 * Hook for fetching a single product by ID
 */
export const useProduct = (id, options = {}) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const fetchProduct = useCallback(async (productId) => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await api.productAPI.getById(productId);
      setProduct(data);

      // Fetch related products (same category)
      if (data.category) {
        const related = await api.productAPI.getByCategory(data.category);
        setRelatedProducts(related.filter(p => p.id !== productId).slice(0, 4));
      }

      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchProduct(id);
  }, [id, fetchProduct]);

  return {
    product,
    loading,
    error,
    relatedProducts,
    refetch: fetchProduct,
  };
};

/**
 * Hook for fetching featured products
 */
export const useFeaturedProducts = (options = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeatured = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.zandetAPI.getFeaturedProducts();
      setProducts(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return {
    products,
    loading,
    error,
    refetch: fetchFeatured,
  };
};

/**
 * Hook for fetching products by category
 */
export const useCategoryProducts = (category, options = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategoryProducts = useCallback(async (categoryName) => {
    if (!categoryName) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.zandetAPI.getCategoryProducts(categoryName);
      setProducts(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchCategoryProducts(category);
  }, [category, fetchCategoryProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchCategoryProducts,
  };
};

// ===================== CATEGORY HOOKS =====================

/**
 * Hook for fetching all categories
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.productAPI.getCategories();
      setCategories(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};

// ===================== SEARCH HOOKS =====================

/**
 * Hook for searching products with debounce
 */
export const useSearch = (query, options = {}) => {
  const {
    debounceDelay = 300,
    minLength = 2,
  } = options;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  
  const timeoutRef = useRef(null);

  const performSearch = useCallback(async (searchQuery) => {
    // Clear pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Validate query length
    if (!searchQuery || searchQuery.length < minLength) {
      setResults([]);
      setSuggestions([]);
      setLoading(false);
      return;
    }

    return new Promise((resolve, reject) => {
      timeoutRef.current = setTimeout(async () => {
        try {
          setLoading(true);
          setError(null);

          // Get suggestions
          const suggestionsData = api.mockAPI.getSearchSuggestions(searchQuery);
          setSuggestions(suggestionsData);

          // Search products
          const data = await api.productAPI.search(searchQuery);
          setResults(data);

          setLoading(false);
          resolve(data);
        } catch (err) {
          setError(err.message);
          setLoading(false);
          reject(err);
        }
      }, debounceDelay);
    });
  }, [debounceDelay, minLength]);

  useEffect(() => {
    performSearch(query);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, performSearch]);

  return {
    results,
    loading,
    error,
    suggestions,
    search: performSearch,
  };
};

// ===================== CART HOOKS =====================

/**
 * Hook for managing cart
 */
export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  // Load cart from localStorage
  const loadCart = useCallback(() => {
    try {
      const savedCart = localStorage.getItem('zandet_cart');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        setCartItems(items);
        updateCartTotals(items);
      }
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  }, []);

  // Update cart totals
  const updateCartTotals = useCallback((items) => {
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    setTotal(totalPrice);
    setItemCount(totalItems);
  }, []);

  // Save cart to localStorage
  const saveCart = useCallback((items) => {
    try {
      localStorage.setItem('zandet_cart', JSON.stringify(items));
      setCartItems(items);
      updateCartTotals(items);
    } catch (err) {
      console.error('Error saving cart:', err);
    }
  }, [updateCartTotals]);

  // Add item to cart
  const addItem = useCallback(async (productId, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch product details if not already in cart
      const product = await api.productAPI.getById(productId);
      
      const existingItem = cartItems.find(item => item.id === productId);
      let newCartItems;

      if (existingItem) {
        newCartItems = cartItems.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCartItems = [
          ...cartItems,
          {
            id: product.id,
            title: product.title,
            price: product.price * 10, // ZANDET pricing
            image: product.image,
            quantity: quantity,
          }
        ];
      }

      saveCart(newCartItems);
      setLoading(false);
      return newCartItems;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [cartItems, saveCart]);

  // Remove item from cart
  const removeItem = useCallback((productId) => {
    try {
      const newCartItems = cartItems.filter(item => item.id !== productId);
      saveCart(newCartItems);
      return newCartItems;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [cartItems, saveCart]);

  // Update item quantity
  const updateQuantity = useCallback((productId, quantity) => {
    try {
      if (quantity <= 0) {
        return removeItem(productId);
      }

      const newCartItems = cartItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      );
      saveCart(newCartItems);
      return newCartItems;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [cartItems, removeItem, saveCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    saveCart([]);
  }, [saveCart]);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return {
    cartItems,
    loading,
    error,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    refreshCart: loadCart,
  };
};

// ===================== WISHLIST HOOKS =====================

/**
 * Hook for managing wishlist
 */
export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load wishlist from localStorage
  const loadWishlist = useCallback(() => {
    try {
      const saved = localStorage.getItem('zandet_wishlist');
      if (saved) {
        setWishlist(JSON.parse(saved));
      } else {
        // Load mock wishlist
        const mockWishlist = api.mockAPI.getUserWishlist();
        setWishlist(mockWishlist);
      }
    } catch (err) {
      console.error('Error loading wishlist:', err);
    }
  }, []);

  // Save wishlist to localStorage
  const saveWishlist = useCallback((items) => {
    try {
      localStorage.setItem('zandet_wishlist', JSON.stringify(items));
      setWishlist(items);
    } catch (err) {
      console.error('Error saving wishlist:', err);
    }
  }, []);

  // Toggle item in wishlist
  const toggleWishlist = useCallback((productId) => {
    try {
      const index = wishlist.indexOf(productId);
      let newWishlist;
      if (index > -1) {
        newWishlist = wishlist.filter(id => id !== productId);
      } else {
        newWishlist = [...wishlist, productId];
      }
      saveWishlist(newWishlist);
      return newWishlist;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [wishlist, saveWishlist]);

  // Check if item is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  // Load wishlist on mount
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  return {
    wishlist,
    loading,
    error,
    toggleWishlist,
    isInWishlist,
    refreshWishlist: loadWishlist,
  };
};

// ===================== PAGINATION HOOK =====================

/**
 * Hook for pagination
 */
export const usePagination = (items, itemsPerPage = 8) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedItems, setPaginatedItems] = useState([]);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setPaginatedItems(items.slice(start, end));
  }, [items, currentPage, itemsPerPage]);

  const goToPage = useCallback((page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
};

// ===================== INFINITE SCROLL HOOK =====================

/**
 * Hook for infinite scroll
 */
export const useInfiniteScroll = (fetchMore, options = {}) => {
  const {
    threshold = 100,
    initialPage = 1,
  } = options;

  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const observerRef = useRef();

  const lastElementRef = useCallback((node) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    }, {
      rootMargin: `0px 0px ${threshold}px 0px`,
    });

    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, threshold]);

  useEffect(() => {
    if (page > initialPage) {
      const loadMore = async () => {
        try {
          setLoading(true);
          const result = await fetchMore(page);
          if (result.length === 0) {
            setHasMore(false);
          }
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      loadMore();
    }
  }, [page, initialPage, fetchMore]);

  return {
    page,
    loading,
    hasMore,
    error,
    lastElementRef,
    reset: () => {
      setPage(initialPage);
      setHasMore(true);
      setError(null);
    },
  };
};

// ===================== DEFAULT EXPORT =====================

export default {
  useApi,
  useProducts,
  useProduct,
  useFeaturedProducts,
  useCategoryProducts,
  useCategories,
  useSearch,
  useCart,
  useWishlist,
  usePagination,
  useInfiniteScroll,
};