import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useStacksAuth } from '../hooks/useStacksAuth';

const Header = () => {
  const { isSignedIn, userData, signIn, signOut } = useStacksAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', current: location.pathname === '/' },
    { name: 'Enroll', href: '/enroll', current: location.pathname === '/enroll' },
    { name: 'Contribute', href: '/contribute', current: location.pathname === '/contribute' },
    { name: 'Claim', href: '/claim', current: location.pathname === '/claim' },
    { name: 'Plans', href: '/plans', current: location.pathname === '/plans' },
  ];

  const handleDisconnect = () => {
    signOut();
    setIsMobileMenuOpen(false);
  };

  const mainnetAddr = userData?.profile?.stxAddress?.mainnet;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Micro-Pension</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.current
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="font-medium">
                    {mainnetAddr?.slice(0, 6)}...{mainnetAddr?.slice(-4)}
                  </span>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={signIn}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  item.current
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {isSignedIn && (
              <div className="pt-4 border-t border-gray-200">
                <div className="px-3 py-2 text-sm text-gray-600">
                  <User className="w-4 h-4 inline mr-2" />
                  {mainnetAddr?.slice(0, 6)}...{mainnetAddr?.slice(-4)}
                </div>
                <button
                  onClick={handleDisconnect}
                  className="w-full mt-2 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
