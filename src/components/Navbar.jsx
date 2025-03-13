import React from 'react';
import { Menu, User, Bell, Settings } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 fixed w-full top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Menu className="h-6 w-6 cursor-pointer" />
          <h1 className="text-2xl font-bold text-emerald-400">AlgoTrade</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <Bell className="h-5 w-5 cursor-pointer" />
          <Settings className="h-5 w-5 cursor-pointer" />
          <User className="h-5 w-5 cursor-pointer" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;