// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import FreeExpressDelivery from './components/FreeExpressDelivery';
import ZandetCare from './components/ZandetCare';
import ExpertSupport from './components/ExpertSupport';
import SecureInfrastructure from './components/SecureInfrastructure';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout'; // Make sure this is imported
import Favorite from './pages/Favorite';
import Account from './pages/Account';
import EditProfile from './pages/EditProfile';
import ProductPage from './pages/ProductPage';
import ProductDetail from './components/ProductDetail';
import AllProduct from './pages/AllProduct';
import SearchResults from './pages/SearchResults';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="pt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} /> {/* Make sure this route exists */}
            <Route path="/wishlist" element={<Favorite />} />
            <Route path="/profile" element={<Account />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/shop" element={<AllProduct />} />
            <Route path="/search" element={<SearchResults />} />
            
            {/* Service Routes */}
            <Route path="/delivery" element={<FreeExpressDelivery />} />
            <Route path="/care" element={<ZandetCare />} />
            <Route path="/support" element={<ExpertSupport />} />
            <Route path="/security" element={<SecureInfrastructure />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;