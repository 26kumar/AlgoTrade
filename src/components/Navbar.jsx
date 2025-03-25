import React, { useState } from 'react';
import { Menu, X, User, Bell, Settings } from 'lucide-react';
import Auth from './Auth';

const Navbar = ({ refs }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleScrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ 
        behavior: "smooth"
      });
      setIsMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    if (refs.homeRef && refs.homeRef.current) {
      refs.homeRef.current.scrollIntoView({
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <nav className="bg-gray-900 text-white px-6 py-4 fixed w-full top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isMenuOpen ? <X className="h-6 w-6 cursor-pointer" /> : <Menu className="h-6 w-6 cursor-pointer" />}
          </button>
          <h1 
            className="text-2xl font-bold text-emerald-400 cursor-pointer hover:text-emerald-300 transition-colors"
            onClick={scrollToTop}
          >
            AlgoTrade
          </h1>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Bell 
              className="h-5 w-5 cursor-pointer hover:text-emerald-400 transition-colors" 
              onClick={toggleNotifications}
            />
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl z-50 p-4">
                <div className="text-center py-4">
                  <p className="text-gray-400">You have no messages right now.</p>
                </div>
              </div>
            )}
          </div>
          
          <User 
            className="h-5 w-5 cursor-pointer hover:text-emerald-400 transition-colors" 
            onClick={() => setIsAuthOpen(true)} 
          />
        </div>
      </nav>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div 
          className="fixed inset-0 bg-black/0 z-40" 
          onClick={toggleNotifications}
        />
      )}

      {/* Sidebar Menu */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-lg p-6 transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-50`}>
        <button onClick={toggleMenu} className="absolute top-4 right-4 text-white">
          <X className="h-6 w-6" />
        </button>
        <ul className="mt-10 space-y-6 text-white text-lg font-semibold">
          <li className="cursor-pointer hover:text-emerald-400" onClick={() => handleScrollToSection(refs.aboutRef)}>About</li>
          <li className="cursor-pointer hover:text-emerald-400" onClick={() => handleScrollToSection(refs.strategiesRef)}>Strategies</li>
          <li className="cursor-pointer hover:text-emerald-400" onClick={() => handleScrollToSection(refs.researchRef)}>Research & Insights</li>
          <li className="cursor-pointer hover:text-emerald-400" onClick={() => handleScrollToSection(refs.productsRef)}>Products & Services</li>
          <li className="cursor-pointer hover:text-emerald-400" onClick={() => handleScrollToSection(refs.analyticsRef)}>Analytics</li>
          <li className="cursor-pointer hover:text-emerald-400" onClick={() => handleScrollToSection(refs.pricingRef)}>Pricing Plans</li>
          <li className="cursor-pointer hover:text-emerald-400" onClick={() => handleScrollToSection(refs.contactRef)}>Contact Us</li>
        </ul>
      </div>

      {/* Overlay */}
      {isMenuOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={toggleMenu}></div>}
      
      {/* Auth Modal */}
      <Auth isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default Navbar;