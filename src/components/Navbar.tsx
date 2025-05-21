
import React, { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import CTAButton from './CTAButton';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleCTAClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="font-bold text-2xl text-audti-primary">Aud<span className="text-audti-secondary">TI</span></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#home" className="text-audti-primary hover:text-audti-secondary font-medium">Home</Link>
            <Link to="/#features" className="text-audti-primary hover:text-audti-secondary font-medium">Funcionalidades</Link>
            <Link to="/support" className="text-audti-primary hover:text-audti-secondary font-medium">Suporte</Link>
            <Link to="/#contact" className="text-audti-primary hover:text-audti-secondary font-medium">Contato</Link>
            <Link to="/audits" className="text-audti-primary hover:text-audti-secondary font-medium">Ver Auditorias</Link>
          </div>

          <div className="hidden md:block">
            <CTAButton variant="primary" onClick={handleCTAClick}>
              {user ? 'Painel' : 'Login'}
            </CTAButton>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-audti-primary" onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/#home" 
                className="text-audti-primary hover:text-audti-secondary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/#features" 
                className="text-audti-primary hover:text-audti-secondary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Funcionalidades
              </Link>
              <Link 
                to="/support" 
                className="text-audti-primary hover:text-audti-secondary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Suporte
              </Link>
              <Link 
                to="/#contact" 
                className="text-audti-primary hover:text-audti-secondary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              <Link 
                to="/audits" 
                className="text-audti-primary hover:text-audti-secondary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Ver Auditorias
              </Link>
              <div className="pt-2">
                <CTAButton 
                  variant="primary" 
                  className="w-full" 
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleCTAClick();
                  }}
                >
                  {user ? 'Painel' : 'Login'}
                </CTAButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
