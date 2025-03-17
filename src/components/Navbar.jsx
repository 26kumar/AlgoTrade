import React, { useState } from 'react';
import { Menu, X, User, Bell, Settings } from 'lucide-react';
import Auth from './Auth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Function to toggle menu open/close
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to scroll smoothly to a section and close menu
  const handleScrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      const offset = 80; // Adjust if navbar covers the section
      const topPos = section.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: topPos, behavior: "smooth" });
    }
    setIsMenuOpen(false); // Close sidebar after clicking a link
  };

  return (
    <>
      <nav className="bg-gray-900 text-white px-6 py-4 fixed w-full top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isMenuOpen ? <X className="h-6 w-6 cursor-pointer" /> : <Menu className="h-6 w-6 cursor-pointer" />}
          </button>
          <h1 className="text-2xl font-bold text-emerald-400 cursor-pointer" onClick={() => handleScrollToSection("home")}>AlgoTrade</h1>
        </div>
        
        <div className="flex gap-4">
          <Bell className="h-5 w-5 cursor-pointer hover:text-emerald-400 transition-colors" />
          <Settings className="h-5 w-5 cursor-pointer hover:text-emerald-400 transition-colors" />
          <User className="h-5 w-5 cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => setIsAuthOpen(true)} />
        </div>
      </nav>

      <div className={`fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-lg p-6 transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}>
        <button onClick={toggleMenu} className="absolute top-4 right-4 text-white">
          <X className="h-6 w-6" />
        </button>
        <ul className="mt-10 space-y-6 text-white text-lg font-semibold">
          <li className="cursor-pointer hover:text-emerald-400" onClick={() => handleScrollToSection("about")}>About</li>
          <li className="cursor-pointer hover:text-emerald-400" onClick={() => handleScrollToSection("strategies")}>Strategies</li>
          <li className="cursor-pointer hover:text-emerald-400" onClick={() => handleScrollToSection("research")}>Research & Insights</li>
          <li className="cursor-pointer hover:text-emerald-400" onClick={() => handleScrollToSection("products")}>Products & Services</li>
          <li className="cursor-pointer hover:text-emerald-400" onClick={() => handleScrollToSection("analytics")}>Analytics</li>
          <li className="cursor-pointer hover:text-emerald-400" onClick={() => handleScrollToSection("pricing")}>Pricing Plans</li>
          <li className="cursor-pointer hover:text-emerald-400" onClick={() => handleScrollToSection("contact-us")}>Contact Us</li>
        </ul>
      </div>

      {isMenuOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={toggleMenu}></div>}
      <Auth isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default Navbar;
