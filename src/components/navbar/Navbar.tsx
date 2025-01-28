'use client';

import Link from 'next/link';
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
        ? isDark 
          ? 'bg-black/40 backdrop-blur-md shadow-lg py-2'
          : 'bg-[#96b3ea42] backdrop-blur-md shadow-lg py-2'
        : 'bg-transparent backdrop-blur-[1px] md:mt-7 mt-2'
      }
      px-4 md:px-0
    `}>
      <div className={`
         mx-auto flex items-center justify-between max-w-[1370px]
        ${isScrolled ? 'h-12' : 'h-16'}
        transition-all duration-300
      `}>
        {/* Logo */}
        <div className="flex items-center cursor-pointer">
          <h1 className={`
            font-bold drop-shadow-md transition-all duration-300
            ${isScrolled 
              ? isDark
                ? 'text-2xl text-white hover:text-white/90'
                : 'text-2xl text-[#1f3c72] hover:text-[#101a67]'
              : 'text-3xl text-white hover:text-white/90'
            }
          `}>
            <Link href="/" onClick={() => window.location.reload()}>Trustra</Link>
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={toggleDarkMode}
            className={`
              rounded-lg transition-all duration-300
              
              ${isScrolled ?
                isDark ? 'bg-white/10 hover:bg-white/20 text-white'
                 : 'bg-[#1a267df6] hover:bg-[#101a67]/90 text-white'
                 : 'bg-white/10'
              } p-1.5   

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