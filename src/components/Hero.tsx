
import React from 'react';
import CTAButton from './CTAButton';

const Hero = () => {
  return (
    <section id="home" className="pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="gradient-text">Auditoria de TI</span> com eficiência e precisão
            </h1>
            <p className="text-lg md:text-xl text-audti-gray mb-8">
              O AudTI é uma solução SaaS premium para técnicos realizarem auditorias presenciais de TI nas unidades do grupo Brasal, garantindo padronização, agilidade e rastreabilidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <CTAButton variant="primary" size="lg">
                Solicite uma demonstração
              </CTAButton>
              <CTAButton variant="outline" size="lg">
                Saiba mais
              </CTAButton>
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-audti-gray`}></div>
                ))}
              </div>
              <p className="ml-4 text-audti-gray">
                Utilizado por <span className="font-bold text-audti-primary">32+ equipes de TI</span>
              </p>
            </div>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-audti-secondary/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-audti-primary/20 rounded-full blur-3xl"></div>
              <div className="relative bg-white p-2 rounded-2xl shadow-2xl w-full max-w-md mx-auto">
                <div className="rounded-xl overflow-hidden border border-audti-light aspect-[9/16] max-h-[500px]">
                  <div className="bg-audti-light h-full flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 mx-auto rounded-full bg-audti-secondary/20 flex items-center justify-center mb-4">
                        <span className="text-audti-secondary text-2xl font-bold">TI</span>
                      </div>
                      <h3 className="text-audti-primary font-bold text-xl mb-2">Auditoria Mobile</h3>
                      <p className="text-audti-gray">Interface intuitiva para auditorias em campo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
