// src/components/SecureInfrastructure.jsx

import React, { useState, useEffect } from 'react';

const SecureInfrastructure = () => {
  const [activeTab, setActiveTab] = useState('encryption');
  const [isHovered, setIsHovered] = useState(false);

  // Animated counter for stats
  const [counters, setCounters] = useState({
    servers: 0,
    uptime: 0,
    threats: 0,
    customers: 0
  });

  useEffect(() => {
    const targetCounters = {
      servers: 2500,
      uptime: 99.9,
      threats: 5000000,
      customers: 1000000
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounters({
        servers: Math.round(targetCounters.servers * progress),
        uptime: (targetCounters.uptime * progress).toFixed(1),
        threats: Math.round(targetCounters.threats * progress).toLocaleString(),
        customers: Math.round(targetCounters.customers * progress).toLocaleString()
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setCounters({
          servers: targetCounters.servers,
          uptime: targetCounters.uptime,
          threats: targetCounters.threats.toLocaleString(),
          customers: targetCounters.customers.toLocaleString()
        });
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  const securityFeatures = [
    {
      id: 'encryption',
      icon: '🔐',
      title: 'End-to-End Encryption',
      description: '256-bit AES encryption protects all your data in transit and at rest.',
      details: [
        'Military-grade encryption standards',
        'Secure data transmission',
        'Protected storage systems'
      ],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'privacy',
      icon: '🛡️',
      title: 'Privacy First',
      description: 'Your personal information is never shared with third parties without consent.',
      details: [
        'GDPR compliant',
        'Zero data sharing',
        'Full transparency'
      ],
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      id: 'network',
      icon: '🌐',
      title: 'Secure Network',
      description: 'Advanced firewall and DDoS protection for uninterrupted service.',
      details: [
        '24/7 network monitoring',
        'DDoS mitigation',
        'Firewall protection'
      ],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      id: 'compliance',
      icon: '✅',
      title: 'Global Compliance',
      description: 'We adhere to international security standards and regulations.',
      details: [
        'ISO 27001 certified',
        'SOC 2 compliant',
        'Regular security audits'
      ],
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    }
  ];

  const securityBadges = [
    { icon: '🔒', label: '256-bit Encryption' },
    { icon: '🛡️', label: 'DDoS Protected' },
    { icon: '✅', label: 'ISO Certified' },
    { icon: '🌍', label: 'GDPR Compliant' },
    { icon: '🔐', label: 'SSL Secure' },
    { icon: '⚡', label: '99.9% Uptime' }
  ];

  return (
    <div className="w-full bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono tracking-widest text-indigo-400 block mb-2">
            SECURE INFRASTRUCTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Enterprise-Grade <span className="text-indigo-400">Security</span>
          </h2>
          <p className="text-gray-400 mt-4 text-lg">
            Your data is protected by world-class security infrastructure
          </p>
        </div>

        {/* Stats Counter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:border-indigo-400/50 transition-all duration-300">
            <p className="text-3xl font-black text-indigo-400">{counters.servers}+</p>
            <p className="text-sm text-gray-400 mt-1">Secure Servers</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:border-indigo-400/50 transition-all duration-300">
            <p className="text-3xl font-black text-indigo-400">{counters.uptime}%</p>
            <p className="text-sm text-gray-400 mt-1">Uptime Guarantee</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:border-indigo-400/50 transition-all duration-300">
            <p className="text-3xl font-black text-indigo-400">{counters.threats}</p>
            <p className="text-sm text-gray-400 mt-1">Threats Blocked</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:border-indigo-400/50 transition-all duration-300">
            <p className="text-3xl font-black text-indigo-400">{counters.customers}+</p>
            <p className="text-sm text-gray-400 mt-1">Trusted Customers</p>
          </div>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {securityFeatures.map((feature) => (
            <div
              key={feature.id}
              className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-${feature.id === 'encryption' ? 'blue' : feature.id === 'privacy' ? 'indigo' : feature.id === 'network' ? 'purple' : 'green'}-400/50 transition-all duration-300 cursor-pointer group`}
              onMouseEnter={() => setActiveTab(feature.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {feature.description}
                  </p>
                  <ul className="mt-3 space-y-1">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-center space-x-2 text-sm text-gray-300">
                        <svg className={`w-4 h-4 ${feature.textColor} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
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

        {/* Security Badges */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h3 className="text-center text-lg font-semibold text-gray-300 mb-6">
            Security Certifications & Badges
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {securityBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300"
              >
                <span className="text-xl">{badge.icon}</span>
                <span className="text-sm font-medium text-gray-300">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust & Transparency Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-2xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">📊</span>
              <h4 className="font-semibold">Transparent Operations</h4>
            </div>
            <p className="text-sm text-gray-400">
              Real-time status updates and complete visibility into our security measures
            </p>
          </div>
          <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 rounded-2xl p-6 border border-indigo-500/20">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">🔍</span>
              <h4 className="font-semibold">Regular Audits</h4>
            </div>
            <p className="text-sm text-gray-400">
              Independent third-party security audits conducted regularly
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">📋</span>
              <h4 className="font-semibold">Privacy Commitment</h4>
            </div>
            <p className="text-sm text-gray-400">
              Your data is yours alone. We never sell or share your personal information
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Your Security is Our Priority</h3>
          <p className="text-indigo-100 mb-4">Learn more about our security infrastructure</p>
          <button className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
            View Security Whitepaper
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SecureInfrastructure);