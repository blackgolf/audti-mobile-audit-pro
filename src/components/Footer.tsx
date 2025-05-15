
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-audti-primary text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-xl mb-4">Aud<span className="text-audti-secondary">TI</span></h4>
            <p className="text-audti-light mb-4">
              Solução premium para auditoria de TI nas empresas do grupo Brasal.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-audti-light hover:text-audti-secondary transition-colors">Home</a></li>
              <li><a href="#features" className="text-audti-light hover:text-audti-secondary transition-colors">Funcionalidades</a></li>
              <li><a href="#support" className="text-audti-light hover:text-audti-secondary transition-colors">Suporte</a></li>
              <li><a href="#contact" className="text-audti-light hover:text-audti-secondary transition-colors">Contato</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Suporte</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-audti-light hover:text-audti-secondary transition-colors">Base de Conhecimento</a></li>
              <li><a href="#" className="text-audti-light hover:text-audti-secondary transition-colors">Tutoriais</a></li>
              <li><a href="#" className="text-audti-light hover:text-audti-secondary transition-colors">FAQ</a></li>
              <li><a href="#" className="text-audti-light hover:text-audti-secondary transition-colors">Contato</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-audti-light hover:text-audti-secondary transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="text-audti-light hover:text-audti-secondary transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-audti-light hover:text-audti-secondary transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-audti-light/30 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {currentYear} AudTI - Grupo Brasal. Todos os direitos reservados.</p>
          
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a href="#" className="text-audti-light hover:text-audti-secondary transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
