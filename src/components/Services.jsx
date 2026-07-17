// src/components/Services.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);

  const features = [
    {
      id: 1,
      title: "Free Express Delivery",
      description: "Complimentary next-day shipping across all flagship devices with real-time biometric tracking updates.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      link: '/delivery',
      component: 'FreeExpressDelivery',
      color: 'from-blue-500 to-blue-600',
      bgHover: 'hover:border-blue-200',
      iconBg: 'group-hover:bg-blue-600',
      textColor: 'text-blue-600'
    },
    {
      id: 2,
      title: "ZANDET Care+",
      description: "Every premium checkout includes an automated 2-year hardware warranty covering accidental failures.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      link: '/care',
      component: 'ZandetCare',
      color: 'from-emerald-500 to-emerald-600',
      bgHover: 'hover:border-emerald-200',
      iconBg: 'group-hover:bg-emerald-600',
      textColor: 'text-emerald-600'
    },
    {
      id: 3,
      title: "24/7 Expert Support",
      description: "Direct connection channels directly to hardware engineers for rapid systems configuration diagnostics.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      link: '/support',
      component: 'ExpertSupport',
      color: 'from-purple-500 to-purple-600',
      bgHover: 'hover:border-purple-200',
      iconBg: 'group-hover:bg-purple-600',
      textColor: 'text-purple-600'
    },
    {
      id: 4,
      title: "Secure Infrastructure",
      description: "Encrypted point-to-point authentication layers securing flexible multi-currency token gateways.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      link: '/security',
      component: 'SecureInfrastructure',
      color: 'from-indigo-500 to-indigo-600',
      bgHover: 'hover:border-indigo-200',
      iconBg: 'group-hover:bg-indigo-600',
      textColor: 'text-indigo-600'
    }
  ];

  const handleNavigate = (link) => {
    navigate(link);
  };

  const handleCardClick = (link) => {
    navigate(link);
  };

  return (
    <section className="w-full bg-white py-16 lg:py-24 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <span className="text-xs font-mono tracking-widest text-indigo-600 uppercase block mb-3">
            Welcome to ZANDET Store
          </span>
          <h2 className="text-3xl font-black tracking-tighter text-gray-950 sm:text-4xl">
            Premium service, built-in.
          </h2>
          <p className="text-gray-500 mt-3 text-lg max-w-2xl">
            Every ZANDER product comes with industry-leading support and protection
          </p>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => (
            <div 
              key={item.id} 
              className={`group relative bg-slate-50/50 border border-gray-100 p-8 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer ${item.bgHover}`}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleCardClick(item.link)}
            >
              {/* Animated Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
              
              {/* Decorative Corner Accent */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 rounded-bl-3xl transition-all duration-500`}></div>

              <div className="relative z-10">
                {/* Icon Box */}
                <div className={`w-12 h-12 rounded-xl bg-white border border-gray-100 text-gray-700 flex items-center justify-center mb-6 ${item.iconBg} group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-sm group-hover:shadow-lg`}>
                  {item.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-950 mb-2 tracking-tight group-hover:text-gray-900 transition-colors">
                  {item.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-500 font-normal leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Interactive link anchor */}
              <div className={`relative z-10 pt-6 mt-6 border-t border-gray-100/60 flex items-center text-xs font-semibold gap-1 transition-all duration-300 ${hoveredId === item.id ? 'opacity-100 text-indigo-600' : 'opacity-0 group-hover:opacity-100'}`}>
                <span>Learn configurations</span>
                <svg className={`w-3 h-3 transform transition-transform duration-300 ${hoveredId === item.id ? 'translate-x-1' : 'group-hover:translate-x-0.5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Hover indicator dot */}
              <div className={`absolute bottom-4 right-4 w-2 h-2 rounded-full transition-all duration-300 ${hoveredId === item.id ? 'bg-indigo-600 scale-100' : 'bg-gray-200 scale-75'}`}></div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="font-bold text-gray-900">4.9/5</p>
                <p className="text-xs text-gray-500">Customer Rating</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-bold text-gray-900">10K+</p>
                <p className="text-xs text-gray-500">Happy Customers</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-bold text-gray-900">99%</p>
                <p className="text-xs text-gray-500">Satisfaction Rate</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">🌍</span>
              <div>
                <p className="font-bold text-gray-900">50+</p>
                <p className="text-xs text-gray-500">Countries Served</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Services);