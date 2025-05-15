
import React from 'react';
import CTAButton from './CTAButton';

const Contact = () => {
  return (
    <section id="contact" className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-gradient-to-r from-audti-primary to-audti-accent rounded-2xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-4">Entre em contato</h2>
              <p className="text-audti-light mb-6">
                Tem dúvidas sobre o AudTI? Preencha o formulário ao lado e nossa equipe entrará em contato o mais breve possível.
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-1">Email</h4>
                  <p className="text-audti-light">suporte@audti.brasal.com.br</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Telefone</h4>
                  <p className="text-audti-light">(61) 3000-0000</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Horário de Suporte</h4>
                  <p className="text-audti-light">Segunda a Sexta, 08h às 18h</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 bg-white p-8 md:p-12">
              <form>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-audti-primary font-medium mb-1">Nome</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-md border border-audti-light focus:outline-none focus:ring-2 focus:ring-audti-secondary"
                    placeholder="Seu nome"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-audti-primary font-medium mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-md border border-audti-light focus:outline-none focus:ring-2 focus:ring-audti-secondary"
                    placeholder="seu.email@empresa.com.br"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-audti-primary font-medium mb-1">Assunto</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 rounded-md border border-audti-light focus:outline-none focus:ring-2 focus:ring-audti-secondary"
                    placeholder="Assunto da mensagem"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-audti-primary font-medium mb-1">Mensagem</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 rounded-md border border-audti-light focus:outline-none focus:ring-2 focus:ring-audti-secondary"
                    placeholder="Sua mensagem aqui..."
                  ></textarea>
                </div>
                <CTAButton variant="primary" className="w-full">
                  Enviar mensagem
                </CTAButton>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
