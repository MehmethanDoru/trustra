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
    <nav className="fixed w-full top-0 z-50 bg-transparent backdrop-blur-[1px] md:mt-7 mt-2 px-4 md:px-0 ">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-md hover:text-white/90 transition-colors">
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