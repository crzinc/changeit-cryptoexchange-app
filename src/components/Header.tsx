import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRightLeft, TrendingUp, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './Auth/AuthModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  
  const { user, isAuthenticated, logout } = useAuth();

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const navItems = [
    { name: 'Exchange', path: '/exchange' },
    { name: 'Markets', path: '/markets' },
    { name: 'About', path: '/about' },
    { name: 'Support', path: '/support' }
  ];

  const userNavItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Profile', path: '/profile' },
    { name: 'Transactions', path: '/transactions' }
  ];
  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-xl border-b border-white/10"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Link to="/" className="flex items-center space-x-2">
              <div className="relative">
                <ArrowRightLeft className="w-8 h-8 text-cyan-400" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Changeit
              </span>
              </Link>
            </motion.div>

            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  as={Link}
                  to={item.path}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ y: -2 }}
                  className={`transition-colors duration-300 font-medium ${
                    location.pathname === item.path 
                      ? 'text-cyan-400' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.name}
                </motion.a>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
                  >
                    <User className="w-4 h-4" />
                    <span>{user?.name}</span>
                  </motion.button>
                  
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-slate-800/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl overflow-hidden"
                    >
                      <div className="p-2">
                        {userNavItems.map((navItem) => (
                          <Link
                            key={navItem.name}
                            to={navItem.path}
                            onClick={() => setShowUserMenu(false)}
                            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                              location.pathname === navItem.path
                                ? 'text-cyan-400 bg-cyan-400/10'
                                : 'text-white/80 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <span>{navItem.name}</span>
                          </Link>
                        ))}
                        <div className="border-t border-white/10 my-2" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openAuthModal('login')}
                    className="px-4 py-2 text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openAuthModal('register')}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-300"
                  >
                    Get Started
                  </motion.button>
                </>
              )}
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-white/10"
            >
              <div className="flex flex-col space-y-4 pt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`transition-colors duration-300 font-medium ${
                      location.pathname === item.path 
                        ? 'text-cyan-400' 
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {isAuthenticated && (
                  <>
                    <div className="border-t border-white/10 my-2" />
                    {userNavItems.map((navItem) => (
                      <Link
                        key={navItem.name}
                        to={navItem.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`transition-colors duration-300 font-medium ${
                          location.pathname === navItem.path 
                            ? 'text-cyan-400' 
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        {navItem.name}
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="text-left text-white/80 hover:text-white transition-colors duration-300 font-medium"
                    >
                      Sign Out
                    </button>
                  </>
                )}
                
                {!isAuthenticated && (
                  <>
                    <div className="border-t border-white/10 my-2" />
                    <button
                      onClick={() => {
                        openAuthModal('login')
                        setIsMenuOpen(false)
                      }}
                      className="text-left text-white/80 hover:text-white transition-colors duration-300 font-medium"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        openAuthModal('register')
                        setIsMenuOpen(false)
                      }}
                      className="text-left text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;