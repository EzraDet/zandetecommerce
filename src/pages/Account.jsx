// src/pages/Account.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useWishlist } from '../services/api';

const Account = () => {
  const navigate = useNavigate();
  const { cartItems, total, itemCount } = useCart();
  const { wishlist } = useWishlist();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, New York, NY 10001',
    bio: 'Tech enthusiast and early adopter. Love exploring new gadgets and smart devices.'
  });
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load order history (mock data)
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOrderHistory([
        {
          id: 'ORD-2024-001',
          date: '2024-01-15',
          total: 299.99,
          status: 'Delivered',
          items: [
            { name: 'ZANDET SoundPro X', quantity: 1, price: 299.99 }
          ]
        },
        {
          id: 'ORD-2024-002',
          date: '2024-02-20',
          total: 749.99,
          status: 'Shipped',
          items: [
            { name: 'Quantum Watch Ultra', quantity: 1, price: 449.99 },
            { name: 'StreamLineBook 14', quantity: 1, price: 300.00 }
          ]
        },
        {
          id: 'ORD-2024-003',
          date: '2024-03-10',
          total: 199.99,
          status: 'Processing',
          items: [
            { name: 'ZANDET Wireless Earbuds', quantity: 1, price: 199.99 }
          ]
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // Stats
  const stats = [
    { label: 'Total Orders', value: orderHistory.length, icon: '📦' },
    { label: 'Wishlist Items', value: wishlist.length, icon: '❤️' },
    { label: 'Cart Items', value: itemCount, icon: '🛒' },
    { label: 'Total Spent', value: `$${orderHistory.reduce((sum, order) => sum + order.total, 0).toFixed(2)}`, icon: '💰' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // In a real app, you would save to backend here
    alert('Profile updated successfully!');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '✅';
      case 'shipped':
        return '📦';
      case 'processing':
        return '⏳';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Navigate to Edit Profile
  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  // Handle order click
  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              My Account
            </h1>
            <p className="text-gray-500 mt-1">Manage your profile and orders</p>
          </div>
          <button
            onClick={handleEditProfile}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Profile
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm p-4 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-28">
              {/* Profile Avatar */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                  {formData.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-bold mt-2">{formData.name}</h3>
                <p className="text-sm text-indigo-200">{formData.email}</p>
                <button
                  onClick={handleEditProfile}
                  className="mt-3 px-4 py-1 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              </div>

              {/* Navigation */}
              <div className="p-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                    activeTab === 'profile'
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                    activeTab === 'orders'
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Orders
                  <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {orderHistory.length}
                  </span>
                </button>
                <button
                  onClick={() => navigate('/wishlist')}
                  className="w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3 text-gray-600 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Wishlist
                  <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3 text-gray-600 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cart
                  <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                </button>
                <div className="border-t border-gray-100 my-3"></div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to logout?')) {
                      navigate('/');
                    }
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3 text-red-500 hover:bg-red-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                  <button
                    onClick={handleEditProfile}
                    className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="pb-3 border-b border-gray-100">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                    <p className="text-gray-900 font-medium">{formData.name}</p>
                  </div>

                  <div className="pb-3 border-b border-gray-100">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                    <p className="text-gray-900">{formData.email}</p>
                  </div>

                  <div className="pb-3 border-b border-gray-100">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                    <p className="text-gray-900">{formData.phone}</p>
                  </div>

                  <div className="pb-3 border-b border-gray-100">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                    <p className="text-gray-900">{formData.address}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Bio</label>
                    <p className="text-gray-600">{formData.bio}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Order History</h2>
                  <span className="text-sm text-gray-500">{orderHistory.length} orders</span>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : orderHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-gray-500">No orders yet</p>
                    <button
                      onClick={() => navigate('/shop')}
                      className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orderHistory.map((order) => (
                      <div 
                        key={order.id} 
                        className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer hover:border-indigo-200"
                        onClick={() => handleOrderClick(order.id)}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-semibold text-gray-900">{order.id}</p>
                            <p className="text-sm text-gray-500">{order.date}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} flex items-center gap-1`}>
                              <span>{getStatusIcon(order.status)}</span>
                              {order.status}
                            </span>
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm text-gray-600 py-1">
                              <span>{item.name} × {item.quantity}</span>
                              <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-gray-400">{order.items.length} items</span>
                          <button 
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOrderClick(order.id);
                            }}
                          >
                            View Details
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Account);