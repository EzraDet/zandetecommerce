// src/pages/FreeExpressDelivery.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FreeExpressDelivery = () => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState({
        hours: 23,
        minutes: 59,
        seconds: 59
    });
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedCountry, setSelectedCountry] = useState('US');

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;

                if (seconds > 0) {
                    return { ...prev, seconds: seconds - 1 };
                } else if (minutes > 0) {
                    return { ...prev, minutes: minutes - 1, seconds: 59 };
                } else if (hours > 0) {
                    return { hours: hours - 1, minutes: 59, seconds: 59 };
                } else {
                    return { hours: 23, minutes: 59, seconds: 59 };
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (value) => String(value).padStart(2, '0');

    const deliveryFeatures = [
        {
            icon: '⚡',
            title: 'Lightning Fast',
            description: 'Next-day delivery on all flagship devices'
        },
        {
            icon: '📍',
            title: 'Real-Time Tracking',
            description: 'Biometric tracking updates every step of the way'
        },
        {
            icon: '🔒',
            title: 'Secure Delivery',
            description: 'Signature required for all premium deliveries'
        },
        {
            icon: '🌍',
            title: 'Global Reach',
            description: 'Express delivery available in 50+ countries'
        }
    ];

    const shippingCountries = [
        { code: 'US', name: 'United States', flag: '🇺🇸', time: '1-2 days' },
        { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', time: '2-3 days' },
        { code: 'CA', name: 'Canada', flag: '🇨🇦', time: '2-3 days' },
        { code: 'AU', name: 'Australia', flag: '🇦🇺', time: '3-4 days' },
        { code: 'DE', name: 'Germany', flag: '🇩🇪', time: '2-3 days' },
        { code: 'FR', name: 'France', flag: '🇫🇷', time: '2-3 days' },
        { code: 'JP', name: 'Japan', flag: '🇯🇵', time: '3-4 days' },
        { code: 'SG', name: 'Singapore', flag: '🇸🇬', time: '2-3 days' }
    ];

    const faqs = [
        {
            question: 'What is the minimum order for free express delivery?',
            answer: 'Free express delivery is available on all orders over $50. Orders below $50 qualify for standard shipping at a flat rate of $5.99.'
        },
        {
            question: 'How can I track my express delivery?',
            answer: 'You\'ll receive a tracking number via email and SMS as soon as your order ships. You can track your package in real-time through our tracking portal.'
        },
        {
            question: 'What if I\'m not home for delivery?',
            answer: 'Our delivery partners will make up to 3 delivery attempts. You can also reschedule your delivery or arrange to pick up from a local collection point.'
        },
        {
            question: 'Is express delivery available internationally?',
            answer: 'Yes, we offer express delivery to over 50 countries. Delivery times vary by destination, typically ranging from 1-5 business days.'
        }
    ];

    const handleCountrySelect = (code) => {
        setSelectedCountry(code);
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        alert('Thank you for subscribing to delivery updates!');
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl overflow-hidden mb-12">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                        }}></div>
                    </div>

                    <div className="relative z-10 p-8 sm:p-12 lg:p-16 text-white">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <span className="text-xs font-mono tracking-widest text-indigo-200 block mb-2">
                                    ZANDET EXPRESS
                                </span>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
                                    Free Express Delivery
                                </h1>
                                <p className="text-lg text-indigo-100 mb-6">
                                    Get your premium devices delivered to your doorstep in record time.
                                    Free express shipping on all orders over $50.
                                </p>

                                {/* Timer */}
                                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl mb-6">
                                    <span className="text-sm font-medium">⏰ Offer ends in:</span>
                                    <div className="flex items-center space-x-1 font-mono font-bold text-xl">
                                        <span className="bg-white/30 px-2 py-1 rounded min-w-[32px] text-center">
                                            {formatTime(timeLeft.hours)}
                                        </span>
                                        <span>:</span>
                                        <span className="bg-white/30 px-2 py-1 rounded min-w-[32px] text-center">
                                            {formatTime(timeLeft.minutes)}
                                        </span>
                                        <span>:</span>
                                        <span className="bg-white/30 px-2 py-1 rounded min-w-[32px] text-center">
                                            {formatTime(timeLeft.seconds)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/shop')}
                                    className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
                                >
                                    Shop Now
                                </button>
                            </div>

                            <div className="flex justify-center lg:justify-end">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                                    <div className="text-6xl mb-2">🚚</div>
                                    <p className="text-sm font-medium">Free Express Delivery</p>
                                    <p className="text-xs text-indigo-200">On orders over $50</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delivery Features */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                        Why Choose Express Delivery?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {deliveryFeatures.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                            >
                                <div className="text-4xl mb-3">{feature.icon}</div>
                                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-500">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('shipping')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'shipping'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Shipping Info
                            </button>
                            <button
                                onClick={() => setActiveTab('tracking')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'tracking'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Track Order
                            </button>
                            <button
                                onClick={() => setActiveTab('faq')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'faq'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                FAQ
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 lg:p-8">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Express Delivery Overview</h3>
                                <p className="text-gray-600 mb-6">
                                    Our express delivery service ensures your ZANDET products arrive quickly and safely.
                                    With real-time tracking and secure handling, you can shop with confidence.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-indigo-50 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold text-indigo-600">1-2</p>
                                        <p className="text-sm text-gray-600">Business Days</p>
                                    </div>
                                    <div className="bg-indigo-50 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold text-indigo-600">24/7</p>
                                        <p className="text-sm text-gray-600">Tracking Available</p>
                                    </div>
                                    <div className="bg-indigo-50 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold text-indigo-600">100%</p>
                                        <p className="text-sm text-gray-600">Secure Delivery</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Shipping Info Tab */}
                        {activeTab === 'shipping' && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Shipping Information</h3>
                                <p className="text-gray-600 mb-6">
                                    Select your country to see estimated delivery times:
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {shippingCountries.map((country) => (
                                        <button
                                            key={country.code}
                                            onClick={() => handleCountrySelect(country.code)}
                                            className={`p-3 rounded-xl border-2 transition-all ${selectedCountry === country.code
                                                    ? 'border-indigo-600 bg-indigo-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xl">{country.flag}</span>
                                                <div className="text-left">
                                                    <p className="text-sm font-medium text-gray-900">{country.name}</p>
                                                    <p className="text-xs text-gray-500">{country.time}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tracking Tab */}
                        {activeTab === 'tracking' && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Track Your Order</h3>
                                <p className="text-gray-600 mb-6">
                                    Enter your tracking number to get real-time updates on your delivery.
                                </p>
                                <form className="flex flex-col sm:flex-row gap-3 max-w-md">
                                    <input
                                        type="text"
                                        placeholder="Enter tracking number"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                                        Track Now
                                    </button>
                                </form>
                                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Order Placed</span>
                                                <span className="text-gray-500">Shipped</span>
                                                <span className="text-gray-500">In Transit</span>
                                                <span className="text-indigo-600 font-semibold">Delivered</span>
                                            </div>
                                            <div className="relative mt-2">
                                                <div className="w-full h-2 bg-gray-200 rounded-full">
                                                    <div className="w-3/4 h-2 bg-indigo-600 rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* FAQ Tab */}
                        {activeTab === 'faq' && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                                <div className="space-y-4">
                                    {faqs.map((faq, index) => (
                                        <div key={index} className="border-b border-gray-100 pb-4">
                                            <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                                            <p className="text-sm text-gray-600">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Newsletter Subscription */}


            </div>
        </div>
    );
};

export default React.memo(FreeExpressDelivery);