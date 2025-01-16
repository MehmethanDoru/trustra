'use client';

import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Sayfa yüklendiğinde dark mode durumunu kontrol et
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white">
            Trustra
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 