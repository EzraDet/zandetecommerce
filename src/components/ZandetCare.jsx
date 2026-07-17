// src/components/ZandetCare.jsx (Accordion Version)

import React, { useState } from 'react';

const ZandetCare = () => {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const features = [
    {
      icon: '🛡️',
      title: 'Premium Warranty',
      description: '2-year comprehensive warranty coverage on all products',
      details: [
        'Accidental damage protection',
        'Free repairs and replacements',
        'Worldwide coverage',
        'Quick claim process'
      ],
      color: 'border-blue-500'
    },
    {
      icon: '🔧',
      title: 'Expert Support',
      description: '24/7 technical support from certified professionals',
      details: [
        'Live chat support',
        'Email assistance',
        'Phone support',
        'Video tutorials'
      ],
      color: 'border-indigo-500'
    },
    {
      icon: '🔄',
      title: 'Easy Returns',
      description: '30-day hassle-free return policy',
      details: [
        'Free return shipping',
        'Full refund guarantee',
        'No questions asked',
        'Quick processing'
      ],
      color: 'border-green-500'
    },
    {
      icon: '🚚',
      title: 'Free Delivery',
      description: 'Express shipping on all orders over $50',
      details: [
        'Real-time tracking',
        'Scheduled delivery',
        'Free insurance',
        'Signature required'
      ],
      color: 'border-purple-500'
    }
  ];

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  return (
    <div className="w-full bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono tracking-widest text-indigo-600 block mb-2">
            ZANDET CARE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
            We've Got You <span className="text-indigo-600">Covered</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md border-l-4 ${feature.color} overflow-hidden transition-all duration-300 ${
                expandedIndex === index ? 'shadow-lg' : 'shadow-sm'
              }`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    expandedIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-4 pt-2 border-t border-gray-100">
                  <ul className="space-y-2">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-center space-x-3 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ZandetCare);