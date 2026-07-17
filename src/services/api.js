// src/services/api.js

import { useState, useEffect, useCallback } from 'react';

// ===================== BASE API CONFIGURATION =====================

// Base API Configuration
const API_CONFIG = {
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// API Endpoints
const ENDPOINTS = {
  products: '/products',
  product: (id) => `/products/${id}`,
  categories: '/products/categories',
  categoryProducts: (category) => `/products/category/${category}`,
  carts: '/carts',
  cart: (id) => `/carts/${id}`,
  users: '/users',
  user: (id) => `/users/${id}`,
};

// ===================== HTTP CLIENT =====================

// HTTP Client with error handling
const httpClient = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
    },
  };

  const fetchOptions = {
    method: options.method || 'GET',
    headers: defaultOptions.headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ===================== PRODUCT API =====================

export const productAPI = {
  // Get all products
  getAll: async (params = {}) => {
    try {
      const response = await httpClient(ENDPOINTS.products);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get product by ID
  getById: async (id) => {
    try {
      const response = await httpClient(ENDPOINTS.product(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await httpClient(ENDPOINTS.categories);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get products by category
  getByCategory: async (category) => {
    try {
      const response = await httpClient(ENDPOINTS.categoryProducts(category));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add new product
  create: async (productData) => {
    try {
      const response = await httpClient(ENDPOINTS.products, {
        method: 'POST',
        body: productData,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update product
  update: async (id, productData) => {
    try {
      const response = await httpClient(ENDPOINTS.product(id), {
        method: 'PUT',
        body: productData,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete product
  delete: async (id) => {
    try {
      const response = await httpClient(ENDPOINTS.product(id), {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get products with limit
  getLimited: async (limit = 5) => {
    try {
      const response = await httpClient(`${ENDPOINTS.products}?limit=${limit}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Search products (local implementation)
  search: async (query) => {
    try {
      const products = await productAPI.getAll();
      return products.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      throw error;
    }
  },
};

// ===================== CART API =====================

export const cartAPI = {
  // Get all carts
  getAll: async () => {
    try {
      const response = await httpClient(ENDPOINTS.carts);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get cart by ID
  getById: async (id) => {
    try {
      const response = await httpClient(ENDPOINTS.cart(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get cart by user ID
  getByUser: async (userId) => {
    try {
      const carts = await cartAPI.getAll();
      return carts.filter(cart => cart.userId === userId);
    } catch (error) {
      throw error;
    }
  },
};

// ===================== USER API =====================

export const userAPI = {
  // Get all users
  getAll: async () => {
    try {
      const response = await httpClient(ENDPOINTS.users);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user by ID
  getById: async (id) => {
    try {
      const response = await httpClient(ENDPOINTS.user(id));
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// ===================== ZANDET BRANDING API =====================

export const zandetAPI = {
  // Enhanced product with ZANDET branding
  getFeaturedProducts: async () => {
    try {
      const products = await productAPI.getLimited(3);
      return products.map((product, index) => ({
        ...product,
        tag: `0${index + 1} // ${product.category.toUpperCase()}`,
        badge: index === 0 ? 'Next-Gen Technology' : 
               index === 1 ? 'Premium Edition' : 'Advanced Series',
        accentColor: index === 0 ? 'bg-indigo-600' : 
                    index === 1 ? 'bg-emerald-600' : 'bg-purple-600',
        accentLight: index === 0 ? 'bg-indigo-50' : 
                    index === 1 ? 'bg-emerald-50' : 'bg-purple-50',
        textColor: index === 0 ? 'text-indigo-600' : 
                   index === 1 ? 'text-emerald-600' : 'text-purple-600',
        borderColor: index === 0 ? 'border-indigo-200' : 
                    index === 1 ? 'border-emerald-200' : 'border-purple-200',
        price: `$${(product.price * 10).toFixed(2)}`,
      }));
    } catch (error) {
      throw error;
    }
  },

  // Get all products with ZANDET styling
  getAllProducts: async () => {
    try {
      const products = await productAPI.getAll();
      return products.map(product => ({
        ...product,
        zandetPrice: `$${(product.price * 10).toFixed(2)}`,
        isNew: product.id % 3 === 0,
        isSale: product.id % 2 === 0,
        rating: (4 + Math.random()).toFixed(1),
        reviews: Math.floor(Math.random() * 100) + 10,
      }));
    } catch (error) {
      throw error;
    }
  },

  // Get products by category with branding
  getCategoryProducts: async (category) => {
    try {
      const products = await productAPI.getByCategory(category);
      return products.map(product => ({
        ...product,
        zandetPrice: `$${(product.price * 10).toFixed(2)}`,
        isNew: product.id % 3 === 0,
        rating: (4 + Math.random()).toFixed(1),
      }));
    } catch (error) {
      throw error;
    }
  },
};

// ===================== MOCK API FOR DEVELOPMENT =====================

export const mockAPI = {
  // Mock search suggestions
  getSearchSuggestions: (query) => {
    const suggestions = [
      'Wireless Headphones',
      'Smart Watch',
      'Laptop Computer',
      'Bluetooth Speaker',
      'Gaming Console',
      'Smartphone',
      'Tablet',
      'Camera',
      'Drone',
      'VR Headset',
      'Earphones',
      'Charger',
      'Power Bank',
      'Monitor',
      'Keyboard',
      'Mouse',
    ];
    return suggestions.filter(s => 
      s.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Mock user wishlist
  getUserWishlist: () => {
    return [1, 3, 5, 7, 9];
  },

  // Mock cart items with quantities
  getCartItems: () => {
    return [
      { productId: 1, quantity: 2, price: 299.99 },
      { productId: 3, quantity: 1, price: 449.99 },
      { productId: 5, quantity: 1, price: 199.99 },
    ];
  },

  // Calculate cart total
  getCartTotal: (cartItems) => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
};

// ===================== PRODUCT HOOKS =====================

// Hook for fetching products
const useProducts = (category = null) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data;
        if (category) {
          data = await zandetAPI.getCategoryProducts(category);
        } else {
          data = await zandetAPI.getAllProducts();
        }
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return { products, loading, error };
};

// Hook for single product
const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getById(id);
        setProduct(data);

        // Fetch related products (same category)
        if (data.category) {
          const related = await productAPI.getByCategory(data.category);
          setRelatedProducts(related.filter(p => p.id !== parseInt(id)).slice(0, 4));
        }

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error, relatedProducts };
};

// Hook for featured products
const useFeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const data = await zandetAPI.getFeaturedProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { products, loading, error };
};

// Hook for categories
const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

// Hook for search
const useSearch = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const searchProducts = async () => {
      try {
        setLoading(true);
        const data = await productAPI.search(query);
        setResults(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return { results, loading, error };
};

// ===================== CART HOOK WITH AUTO-REFRESH =====================

const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger

  // Load cart from localStorage
  const loadCart = useCallback(() => {
    try {
      const savedCart = localStorage.getItem('zandet_cart');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        setCartItems(items);
        updateCartTotals(items);
      } else {
        setCartItems([]);
        updateCartTotals([]);
      }
    } catch (err) {
      console.error('Error loading cart:', err);
      setCartItems([]);
      updateCartTotals([]);
    }
  }, []);

  // Update cart totals
  const updateCartTotals = useCallback((items) => {
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    setTotal(totalPrice);
    setItemCount(totalItems);
  }, []);

  // Save cart to localStorage and trigger refresh
  const saveCart = useCallback((items) => {
    try {
      localStorage.setItem('zandet_cart', JSON.stringify(items));
      setCartItems(items);
      updateCartTotals(items);
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
    } catch (err) {
      console.error('Error saving cart:', err);
    }
  }, [updateCartTotals]);

  // Add item to cart
  const addItem = useCallback(async (productId, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);

      const existingItem = cartItems.find(item => item.id === productId);
      let newCartItems;

      if (existingItem) {
        newCartItems = cartItems.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        const product = await response.json();
        
        newCartItems = [
          ...cartItems,
          {
            id: product.id,
            title: product.title,
            price: product.price * 10,
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

  // Get cart total
  const getCartTotal = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  // Refresh cart - force update
  const refreshCart = useCallback(() => {
    loadCart();
    setRefreshTrigger(prev => prev + 1);
  }, [loadCart]);

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
    getCartTotal,
    refreshCart,
    refreshTrigger, // Expose refresh trigger
  };
};

// ===================== WISHLIST HOOK WITH AUTO-REFRESH =====================

const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger

  // Load wishlist from localStorage
  const loadWishlist = useCallback(() => {
    try {
      const saved = localStorage.getItem('zandet_wishlist');
      if (saved) {
        setWishlist(JSON.parse(saved));
      } else {
        setWishlist([]);
      }
    } catch (err) {
      console.error('Error loading wishlist:', err);
      setWishlist([]);
    }
  }, []);

  // Save wishlist to localStorage and trigger refresh
  const saveWishlist = useCallback((items) => {
    try {
      localStorage.setItem('zandet_wishlist', JSON.stringify(items));
      setWishlist(items);
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
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

  // Add to wishlist
  const addToWishlist = useCallback((productId) => {
    if (!isInWishlist(productId)) {
      const newWishlist = [...wishlist, productId];
      saveWishlist(newWishlist);
      return newWishlist;
    }
    return wishlist;
  }, [wishlist, isInWishlist, saveWishlist]);

  // Remove from wishlist
  const removeFromWishlist = useCallback((productId) => {
    if (isInWishlist(productId)) {
      const newWishlist = wishlist.filter(id => id !== productId);
      saveWishlist(newWishlist);
      return newWishlist;
    }
    return wishlist;
  }, [wishlist, isInWishlist, saveWishlist]);

  // Clear wishlist
  const clearWishlist = useCallback(() => {
    saveWishlist([]);
  }, [saveWishlist]);

  // Refresh wishlist - force update
  const refreshWishlist = useCallback(() => {
    loadWishlist();
    setRefreshTrigger(prev => prev + 1);
  }, [loadWishlist]);

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
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    refreshWishlist,
    refreshTrigger, // Expose refresh trigger
  };
};

// ===================== EXPORTS =====================

// Export all hooks and APIs
export {
  useProducts,
  useProduct,
  useFeaturedProducts,
  useCategories,
  useSearch,
  useCart,
  useWishlist,
};

// Default export (without duplicating the hooks)
const api = {
  productAPI,
  cartAPI,
  userAPI,
  zandetAPI,
  mockAPI,
  API_CONFIG,
};

export default api;