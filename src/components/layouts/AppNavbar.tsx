
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, ClipboardCheck, Building, FileCheck, FilePieChart, Settings, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';

const AppNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useRole();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, requiresAuth: true },
    { name: 'Auditorias', path: '/audits', icon: <ClipboardCheck className="w-5 h-5" />, requiresAuth: false },
    { name: 'Unidades', path: '/units', icon: <Building className="w-5 h-5" />, requiresAuth: true },
    { name: 'Checklists', path: '/checklists', icon: <FileCheck className="w-5 h-5" />, requiresAuth: true },
    { name: 'Relatórios', path: '/reports', icon: <FilePieChart className="w-5 h-5" />, requiresAuth: true },
    { name: 'Configurações', path: '/settings', icon: <Settings className="w-5 h-5" />, requiresAuth: true },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    signOut();
  };

  // Filter items based on authentication status
  const filteredNavItems = navItems.filter(item => !item.requiresAuth || user);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center">
              <span className="font-bold text-2xl text-audti-primary">Aud<span className="text-audti-secondary">TI</span></span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-audti-secondary bg-audti-primary/5'
                    : 'text-audti-primary hover:text-audti-secondary hover:bg-audti-primary/5'
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
            
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-2">Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-audti-secondary hover:text-audti-secondary hover:bg-audti-primary/5 transition-colors duration-200"
              >
                <User className="w-5 h-5" />
                <span className="ml-2">Login</span>
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-audti-primary focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-audti-secondary bg-audti-primary/5'
                      : 'text-audti-primary hover:text-audti-secondary hover:bg-audti-primary/5'
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Link>
              ))}
              
              {user ? (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="ml-2">Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-audti-secondary hover:text-audti-secondary hover:bg-audti-primary/5 transition-colors duration-200"
                >
                  <User className="w-5 h-5" />
                  <span className="ml-2">Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppNavbar;
