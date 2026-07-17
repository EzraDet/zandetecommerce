// src/pages/About.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('story');
  const [isVisible, setIsVisible] = useState({});

  // Animated counter for stats
  const [counters, setCounters] = useState({
    products: 0,
    customers: 0,
    countries: 0,
    satisfaction: 0
  });

  useEffect(() => {
    const targetCounters = {
      products: 500,
      customers: 100000,
      countries: 50,
      satisfaction: 99
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounters({
        products: Math.round(targetCounters.products * progress),
        customers: Math.round(targetCounters.customers * progress).toLocaleString(),
        countries: Math.round(targetCounters.countries * progress),
        satisfaction: Math.round(targetCounters.satisfaction * progress)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setCounters({
          products: targetCounters.products,
          customers: targetCounters.customers.toLocaleString(),
          countries: targetCounters.countries,
          satisfaction: targetCounters.satisfaction
        });
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: 'Alex Chen',
      role: 'CEO & Founder',
      bio: 'Visionary leader with 15+ years in tech innovation',
      image: 'https://ui-avatars.com/api/?name=Alex+Chen&background=4F46E5&color=fff&size=128',
      linkedin: '#',
      twitter: '#'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Head of Product',
      bio: 'Product strategist passionate about user-centric design',
      image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=7C3AED&color=fff&size=128',
      linkedin: '#',
      twitter: '#'
    },
    {
      id: 3,
      name: 'Michael Park',
      role: 'Lead Engineer',
      bio: 'Full-stack architect building scalable solutions',
      image: 'https://ui-avatars.com/api/?name=Michael+Park&background=059669&color=fff&size=128',
      linkedin: '#',
      twitter: '#'
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      role: 'Head of Design',
      bio: 'Award-winning designer creating intuitive experiences',
      image: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=DC2626&color=fff&size=128',
      linkedin: '#',
      twitter: '#'
    }
  ];

  const values = [
    {
      icon: '💡',
      title: 'Innovation First',
      description: 'We push boundaries to bring you the latest technology'
    },
    {
      icon: '❤️',
      title: 'Customer Obsessed',
      description: 'Your satisfaction drives every decision we make'
    },
    {
      icon: '🤝',
      title: 'Trust & Transparency',
      description: 'We build lasting relationships through honesty'
    },
    {
      icon: '🌍',
      title: 'Global Impact',
      description: 'Making technology accessible worldwide'
    }
  ];

  const milestones = [
    { year: '2018', title: 'Founded', description: 'ZANDET was born with a vision' },
    { year: '2019', title: 'First Product', description: 'Launched our first flagship device' },
    { year: '2020', title: 'Global Expansion', description: 'Reached 25 countries' },
    { year: '2022', title: 'Innovation Award', description: 'Recognized for tech excellence' },
    { year: '2024', title: '10K+ Customers', description: 'Milestone achievement' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-indigo-600 block mb-3">
            ABOUT ZANDET
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-6">
            Redefining the Future of
            <span className="text-indigo-600 block">Technology</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            We're on a mission to create premium technology that enhances lives 
            and pushes the boundaries of what's possible.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Founded in 2018, ZANDET emerged from a simple belief: technology should 
                be both powerful and accessible. What started as a small team of 
                passionate innovators has grown into a global brand trusted by thousands.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Today, we continue to push the boundaries of innovation, designing 
                products that seamlessly blend cutting-edge technology with elegant 
                design. Every device we create is engineered to enhance your life.
              </p>
              <button 
                onClick={() => navigate('/shop')}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Explore Our Products
              </button>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold">Innovation Since 2018</h3>
                <p className="text-indigo-100 mt-2">Pushing boundaries every day</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow duration-300">
            <p className="text-3xl font-black text-indigo-600">{counters.products}+</p>
            <p className="text-sm text-gray-500 mt-1">Products</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow duration-300">
            <p className="text-3xl font-black text-indigo-600">{counters.customers}+</p>
            <p className="text-sm text-gray-500 mt-1">Happy Customers</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow duration-300">
            <p className="text-3xl font-black text-indigo-600">{counters.countries}+</p>
            <p className="text-sm text-gray-500 mt-1">Countries</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow duration-300">
            <p className="text-3xl font-black text-indigo-600">{counters.satisfaction}%</p>
            <p className="text-sm text-gray-500 mt-1">Satisfaction Rate</p>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">{value.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm text-indigo-600 font-medium">{member.role}</p>
                <p className="text-sm text-gray-500 mt-2">{member.bio}</p>
                <div className="flex justify-center space-x-3 mt-3">
                  <a href={member.linkedin} className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zm-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </a>
                  <a href={member.twitter} className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline / Milestones */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-200"></div>
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex items-center mb-8 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <span className="text-sm font-mono text-indigo-600 font-bold">{milestone.year}</span>
                    <h3 className="font-bold text-gray-900">{milestone.title}</h3>
                    <p className="text-sm text-gray-500">{milestone.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white shadow"></div>
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-center text-white">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">Join the ZANDET Community</h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Be part of a community that's shaping the future of technology. 
            Subscribe to our newsletter for exclusive updates and offers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-lg text-gray-900 min-w-[250px] max-w-sm focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(About);