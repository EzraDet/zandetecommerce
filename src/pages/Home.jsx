// src/pages/Home.jsx

import React from 'react';
import SlideShow from '../components/SlideShow';
import Services from '../components/Services';
import ZandetCare from '../components/ZandetCare';
import ExpertSupport from '../components/ExpertSupport';
import SecureInfrastructure from '../components/SecureInfrastructure';
import FeatureProduct from '../components/FeatureProduct';

const Home = () => {
  return (
    <>
      <SlideShow />
      <Services />
      
      <FeatureProduct />
    </>
  );
};

export default Home;