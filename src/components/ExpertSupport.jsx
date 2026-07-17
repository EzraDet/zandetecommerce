// src/components/ExpertSupport.jsx

import React, { useState } from 'react';

const ExpertSupport = () => {
  const [activeSupport, setActiveSupport] = useState('chat');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const supportOptions = [
    {
      id: 'chat',
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with our experts in real-time',
      availability: 'Available 24/7',
      action: 'Start Chat'
    },
    {
      id: 'email',
      icon: '📧',
      title: 'Email Support',
      description: 'Get detailed assistance via email',
      availability: 'Response within 24 hours',
      action: 'Send Email'
    },
    {
      id: 'phone',
      icon: '📞',
      title: 'Phone Support',
      description: 'Speak directly with a support specialist',
      availability: 'Available 9AM - 9PM EST',
      action: 'Call Now'
    },
    {
      id: 'video',
      icon: '🎥',
      title: 'Video Call',
      description: 'Face-to-face support from anywhere',
      availability: 'By appointment',
      action: 'Schedule Call'
    }
  ];

  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order by logging into your account and visiting the "My Orders" section. You\'ll receive a tracking number via email once your order ships.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day hassle-free return policy. If you\'re not satisfied with your purchase, you can return it within 30 days for a full refund.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. International shipping times vary by location.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by destination.'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleSupportClick = (id) => {
    setActiveSupport(id);
    // Scroll to contact section on mobile
    if (window.innerWidth < 768) {
      document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono tracking-widest text-indigo-600 block mb-2">
            EXPERT SUPPORT
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
            We're Here to <span className="text-indigo-600">Help</span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg">
            Get expert assistance from our dedicated support team
          </p>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {supportOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSupportClick(option.id)}
              className={`group p-6 rounded-2xl text-left transition-all duration-300 ${
                activeSupport === option.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                  : 'bg-white hover:bg-indigo-50 text-gray-700 shadow-md hover:shadow-lg'
              }`}
            >
              <div className="flex items-start space-x-4">
                <span className={`text-3xl ${activeSupport === option.id ? '' : 'group-hover:scale-110 transition-transform'}`}>
                  {option.icon}
                </span>
                <div>
                  <h3 className={`font-bold ${activeSupport === option.id ? 'text-white' : 'text-gray-900'}`}>
                    {option.title}
                  </h3>
                  <p className={`text-sm ${activeSupport === option.id ? 'text-indigo-100' : 'text-gray-500'}`}>
                    {option.description}
                  </p>
                  <p className={`text-xs mt-1 ${activeSupport === option.id ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {option.availability}
                  </p>
                  <span className={`text-sm font-medium mt-2 inline-block ${
                    activeSupport === option.id ? 'text-white' : 'text-indigo-600 group-hover:text-indigo-700'
                  }`}>
                    {option.action} →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div id="contact-section" className="bg-white rounded-2xl shadow-md p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Get in Touch</h3>
            <p className="text-gray-500 text-sm mb-6">
              Fill out the form below and we'll get back to you within 24 hours
            </p>

            {isSubmitted && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm animate-fade-in">
                ✓ Thank you! Your message has been sent successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="order">Order Inquiry</option>
                  <option value="product">Product Question</option>
                  <option value="return">Return Request</option>
                  <option value="support">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe your issue or question..."
                  rows="4"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h3>
            <p className="text-gray-500 text-sm mb-6">
              Quick answers to common questions
            </p>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4"
                >
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {faq.question}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-indigo-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-indigo-600">98%</p>
                <p className="text-xs text-gray-600">Satisfaction Rate</p>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-indigo-600">2min</p>
                <p className="text-xs text-gray-600">Average Response</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Hours */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div>
              <span className="text-3xl">🕐</span>
              <h4 className="font-bold mt-2">24/7 Support</h4>
              <p className="text-sm text-indigo-100">Always here to help</p>
            </div>
            <div>
              <span className="text-3xl">⚡</span>
              <h4 className="font-bold mt-2">Fast Response</h4>
              <p className="text-sm text-indigo-100">Average 2 minutes</p>
            </div>
            <div>
              <span className="text-3xl">🌍</span>
              <h4 className="font-bold mt-2">Global Reach</h4>
              <p className="text-sm text-indigo-100">50+ countries</p>
            </div>
            <button className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ExpertSupport);