'use client'; 

import { useState } from 'react';
import Link from 'next/link'; // For client-side navigation
import { Menu, X } from 'lucide-react'; // Importing icons for the hamburger menu

export default function Header() {
  // State to track if the mobile menu is open or closed
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Tabs' },
    { href: '/pre-lab-questions', label: 'Pre-lab Questions' },
    { href: '/escape-room', label: 'Escape Room' },
    { href: '/coding-races', label: 'Coding Races' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Side: Student Number */}
          <div className="text-lg font-bold text-gray-800 dark:text-white">
            <span>22586609</span>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side: Theme Toggle and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Placeholder for Theme Toggle */}
            <div className="text-sm">
              <span>Dark Mode Toggle</span>
            </div>

            {/* Mobile Menu Button (Hamburger Icon) */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 dark:text-gray-300 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu (conditionally rendered) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <nav className="flex flex-col space-y-2 p-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-md text-center" onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}