// components/Navigation.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('studentToken');
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentName');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold">GestudiApp</Link>
          
          {/* Menu pour mobile */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Menu pour desktop */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/" className={`py-2 hover:text-blue-300 ${pathname === '/' ? 'text-blue-300' : ''}`}>
              Accueil
            </Link>
            <Link href="/formations" className={`py-2 hover:text-blue-300 ${pathname === '/formations' ? 'text-blue-300' : ''}`}>
              Formations
            </Link>
            <Link href="/about" className={`py-2 hover:text-blue-300 ${pathname === '/about' ? 'text-blue-300' : ''}`}>
              À propos
            </Link>
            <Link href="/contact" className={`py-2 hover:text-blue-300 ${pathname === '/contact' ? 'text-blue-300' : ''}`}>
              Contact
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className={`py-2 hover:text-blue-300 ${pathname === '/dashboard' ? 'text-blue-300' : ''}`}>
                  Tableau de bord
                </Link>
                <Link href="/profile" className={`py-2 hover:text-blue-300 ${pathname === '/profile' ? 'text-blue-300' : ''}`}>
                  Profil
                </Link>
                <button 
                  onClick={handleLogout}
                  className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg ml-2"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  Connexion
                </Link>
                <Link href="/register" className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Menu mobile ouvert */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <Link href="/" className={`block py-2 hover:text-blue-300 ${pathname === '/' ? 'text-blue-300' : ''}`}>
              Accueil
            </Link>
            <Link href="/formations" className={`block py-2 hover:text-blue-300 ${pathname === '/formations' ? 'text-blue-300' : ''}`}>
              Formations
            </Link>
            <Link href="/about" className={`block py-2 hover:text-blue-300 ${pathname === '/about' ? 'text-blue-300' : ''}`}>
              À propos
            </Link>
            <Link href="/contact" className={`block py-2 hover:text-blue-300 ${pathname === '/contact' ? 'text-blue-300' : ''}`}>
              Contact
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className={`block py-2 hover:text-blue-300 ${pathname === '/dashboard' ? 'text-blue-300' : ''}`}>
                  Tableau de bord
                </Link>
                <Link href="/profile" className={`block py-2 hover:text-blue-300 ${pathname === '/profile' ? 'text-blue-300' : ''}`}>
                  Profil
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg mt-2"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg mt-2">
                  Connexion
                </Link>
                <Link href="/register" className="block w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg mt-2">
                  Inscription
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}