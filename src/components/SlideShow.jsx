// src/components/SlideShow.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const SlideShow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      tag: "01 // AUDIO",
      badge: "Next-Gen ANC",
      title: "Foldsack No. 1 Backpack",
      description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
      price: "$1,099.50",
      accentColor: "bg-indigo-600",
      accentLight: "bg-indigo-50",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-200",
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
      productId: 1 // Map to actual product ID
    },
    {
      id: 2,
      tag: "02 // WEARABLES",
      badge: "Titanium Edition",
      title: "Mens Casual Premium",
      description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket",
      price: "$223.00",
      accentColor: "bg-emerald-600",
      accentLight: "bg-emerald-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
      productId: 2 // Map to actual product ID
    },
    {
      id: 3,
      tag: "03 // COMPUTING",
      badge: "Neural Architecture",
      title: "Mens Cotton Jacket",
      description: "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors.",
      price: "$559.90",
      accentColor: "bg-purple-600",
      accentLight: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-200",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
      productId: 3 // Map to actual product ID
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // Auto-slide with pause on hover
  useEffect(() => {
    if (isHovered) return;
    
    const slideInterval = setInterval(nextSlide, 7000);
    return () => clearInterval(slideInterval);
  }, [isHovered, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Handle Purchase Device click - Navigate to product detail
  const handlePurchaseClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Handle Specifications click - Navigate to product detail with specs tab
  const handleSpecsClick = (productId) => {
    navigate(`/product/${productId}?tab=specs`);
  };

  return (
    <div 
      className="w-full bg-gray-50/50 py-8 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Bento Slide Frame - Updated with Navbar styling */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden min-h-[520px] lg:min-h-[580px] grid grid-cols-1 lg:grid-cols-12">
          
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 grid grid-cols-1 lg:grid-cols-12 w-full h-full transition-all duration-700 ease-in-out ${
                index === currentSlide 
                  ? 'opacity-100 z-10 pointer-events-auto scale-100' 
                  : 'opacity-0 z-0 pointer-events-none scale-[0.98]'
              }`}
            >
              {/* Left Column: Premium Details Panel */}
              <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative z-20 bg-white/80 backdrop-blur-sm">
                <div>
                  {/* Categorization Tag - Updated */}
                  <span className="text-xs font-mono tracking-widest text-gray-400 block mb-6">
                    {slide.tag}
                  </span>
                  
                  {/* Badge - Updated with Navbar style */}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-4 border border-gray-200`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${slide.accentColor}`}></span>
                    {slide.badge}
                  </span>

                  {/* Title - Updated with Navbar typography */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 leading-none mb-4">
                    {slide.title}
                  </h1>

                  {/* Description - Updated */}
                  <p className="text-gray-500 text-base sm:text-lg max-w-xl font-normal leading-relaxed mb-6">
                    {slide.description}
                  </p>
                </div>

                {/* Bottom Row Actions - Updated with Navbar style */}
                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Price</p>
                    <p className="text-2xl font-bold text-gray-900">{slide.price}</p>
                  </div>
                  <div className="flex gap-3 ml-auto sm:ml-0">
                    <button 
                      onClick={() => handlePurchaseClick(slide.productId)}
                      className={`${slide.accentColor} hover:opacity-90 text-white font-medium text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-${slide.accentColor}/20 hover:shadow-lg hover:scale-105 transform duration-200`}
                    >
                      Purchase Device
                    </button>
                    <button 
                      onClick={() => handleSpecsClick(slide.productId)}
                      className="bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 font-medium text-sm px-5 py-3 rounded-xl transition-colors hover:border-gray-300 hover:shadow-md"
                    >
                      Specifications
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Abstract Geometric Art Canvas - Updated */}
              <div className="lg:col-span-5 bg-gray-50/50 relative hidden lg:flex items-center justify-center p-12 overflow-hidden border-l border-gray-100">
                {/* Dynamic Subtle Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60"></div>
                
                {/* Decorative Rotating Geometric Card Accent */}
                <div className={`absolute w-72 h-72 rounded-[40px] opacity-10 blur-xl rotate-45 animate-pulse ${slide.accentColor}`}></div>
                <div className="absolute w-80 h-80 rounded-full border border-gray-200/60 scale-95 pointer-events-none"></div>
                
                {/* Product Showcase Asset */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="max-h-[340px] w-auto object-contain rounded-2xl relative z-10 transition-transform duration-700 select-none drop-shadow-2xl hover:scale-105 cursor-pointer"
                  onClick={() => handlePurchaseClick(slide.productId)}
                />
              </div>

            </div>
          ))}

          {/* Interactive Numeric Index / Progress Bar Track - Updated */}
          <div className="absolute bottom-8 left-8 sm:left-12 lg:left-16 z-30 flex items-center space-x-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="group flex items-center focus:outline-none py-2 focus:ring-2 focus:ring-indigo-500 rounded-lg px-1"
                aria-label={`Go to slide ${index + 1}`}
              >
                <span className={`text-xs font-mono font-bold transition-colors duration-300 ${
                  index === currentSlide ? 'text-gray-900' : 'text-gray-300 group-hover:text-gray-400'
                }`}>
                  0{index + 1}
                </span>
                <span className={`h-[2px] ml-2 transition-all duration-500 ${
                  index === currentSlide ? 'w-8 bg-gray-900' : 'w-3 bg-gray-200 group-hover:bg-gray-300'
                }`} />
              </button>
            ))}
          </div>

          {/* Combined Navigation Controller - Updated with Navbar style */}
          <div className="absolute bottom-8 right-8 lg:right-auto lg:left-[50%] lg:-translate-x-1/2 z-30 flex items-center bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl shadow-md p-1 gap-1">
            <button
              onClick={prevSlide}
              className="p-2 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Previous Slide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
            <button
              onClick={nextSlide}
              className="p-2 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Next Slide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default React.memo(SlideShow);