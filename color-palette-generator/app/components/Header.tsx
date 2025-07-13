'use client';

import Link from 'next/link';
import { Palette } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and title */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Palette size={24} className="text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Color Palette Generator
            </h1>
          </Link>

          {/* Navigation and theme switcher */}
          <div className="flex items-center space-x-4">
            <nav className="hidden sm:flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Generator
              </Link>
              <Link 
                href="/saved" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Saved Palettes
              </Link>
            </nav>
            
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
