'use client';

import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className={`
      fixed w-full top-0 z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-black/40 backdrop-blur-md shadow-lg py-2' 
        : 'bg-transparent backdrop-blur-[1px] md:mt-7 mt-2'
      }
      px-4 md:px-0
    `}>
      <div className={`
        container mx-auto flex items-center justify-between
        ${isScrolled ? 'h-12' : 'h-16'}
        transition-all duration-300
      `}>
        {/* Logo */}
        <div className="flex items-center">
          <h1 className={`
            font-bold text-white drop-shadow-md hover:text-white/90 transition-all duration-300
            ${isScrolled ? 'text-2xl' : 'text-3xl'}
          `}>
            Trustra
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={toggleDarkMode}
            className={`
              rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300
              ${isScrolled ? 'p-1.5 text-sm' : 'p-2'}
            `}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 