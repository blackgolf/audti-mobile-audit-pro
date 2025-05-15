
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import CTAButton from './CTAButton';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="font-bold text-2xl text-audti-primary">Aud<span className="text-audti-secondary">TI</span></span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-audti-primary hover:text-audti-secondary font-medium">Home</a>
            <a href="#features" className="text-audti-primary hover:text-audti-secondary font-medium">Funcionalidades</a>
            <a href="#support" className="text-audti-primary hover:text-audti-secondary font-medium">Suporte</a>
            <a href="#contact" className="text-audti-primary hover:text-audti-secondary font-medium">Contato</a>
          </div>

          <div className="hidden md:block">
            <CTAButton variant="primary">Login</CTAButton>
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
              <a 
                href="#home" 
                className="text-audti-primary hover:text-audti-secondary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="#features" 
                className="text-audti-primary hover:text-audti-secondary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Funcionalidades
              </a>
              <a 
                href="#support" 
                className="text-audti-primary hover:text-audti-secondary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Suporte
              </a>
              <a 
                href="#contact" 
                className="text-audti-primary hover:text-audti-secondary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </a>
              <div className="pt-2">
                <CTAButton variant="primary" className="w-full">Login</CTAButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
