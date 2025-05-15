
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      
      {/* Support Section */}
      <section id="support" className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Central de Suporte</h2>
            <p className="text-lg text-audti-gray max-w-2xl mx-auto">
              Recursos para auxiliar no uso do sistema e solução de dúvidas.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-audti-light">
              <div className="h-12 w-12 rounded-full bg-audti-secondary/20 flex items-center justify-center mb-4">
                <span className="text-audti-secondary text-xl font-bold">?</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-audti-primary">FAQs</h3>
              <p className="text-audti-gray mb-4">
                Encontre respostas para as perguntas mais frequentes sobre o sistema.
              </p>
              <a href="#" className="text-audti-secondary hover:underline">Consultar FAQs →</a>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-audti-light">
              <div className="h-12 w-12 rounded-full bg-audti-secondary/20 flex items-center justify-center mb-4">
                <span className="text-audti-secondary text-xl font-bold">T</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-audti-primary">Tutoriais</h3>
              <p className="text-audti-gray mb-4">
                Guias passo a passo para utilização de todas as funcionalidades.
              </p>
              <a href="#" className="text-audti-secondary hover:underline">Ver tutoriais →</a>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-audti-light">
              <div className="h-12 w-12 rounded-full bg-audti-secondary/20 flex items-center justify-center mb-4">
                <span className="text-audti-secondary text-xl font-bold">V</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-audti-primary">Vídeos</h3>
              <p className="text-audti-gray mb-4">
                Treinamentos em vídeo para maximizar sua produtividade com o AudTI.
              </p>
              <a href="#" className="text-audti-secondary hover:underline">Assistir vídeos →</a>
            </div>
          </div>
        </div>
      </section>
      
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
