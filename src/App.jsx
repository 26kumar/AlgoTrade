import React from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Strategies from './components/Strategies';
import Research from './components/Research';
import Products from './components/Products';
import Analytics from './components/Analytics';
import Pricing from './components/Pricing';
import Contact from './components/Contact';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <Home />
      <About />
      <Strategies />
      <Research />
      <Products />
      <Analytics />
      <Pricing />
      <Contact />
    </div>
  );
}

export default App;