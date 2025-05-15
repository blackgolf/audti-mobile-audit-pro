
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CTAButton from '@/components/CTAButton';
import { toast } from '@/hooks/use-toast';

const SupportPortal = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const faqs = [
    {
      question: "Como iniciar uma nova auditoria?",
      answer: "Para iniciar uma nova auditoria, acesse o Dashboard principal e clique no botão 'Nova Auditoria'. Em seguida, selecione a unidade a ser auditada e preencha o formulário com as informações solicitadas."
    },
    {
      question: "Como adicionar fotos durante a auditoria?",
      answer: "Durante a auditoria, você encontrará um ícone de câmera em cada item do checklist. Clique nele para capturar uma foto usando a câmera do dispositivo ou selecionar uma imagem da galeria."
    },
    {
      question: "Como exportar relatórios?",
      answer: "Acesse a seção de Relatórios, selecione a unidade e o período desejado, e clique no botão 'Exportar'. Você poderá escolher entre os formatos PDF ou Excel."
    },
    {
      question: "O aplicativo funciona offline?",
      answer: "Sim! O AudTI foi desenvolvido para funcionar em áreas com conexão limitada. Você pode realizar auditorias offline e os dados serão sincronizados automaticamente quando houver conexão disponível."
    },
    {
      question: "Como criar um novo checklist?",
      answer: "Apenas usuários com perfil de Administrador podem criar checklists. Na seção 'Checklists', clique em 'Novo Checklist', defina as categorias, perguntas e pesos para cada item."
    }
  ];
  
  const tutorials = [
    {
      title: "Guia de início rápido",
      description: "Aprenda os fundamentos básicos para começar a utilizar o AudTI em minutos.",
      link: "#guia-inicio"
    },
    {
      title: "Configurando sua primeira auditoria",
      description: "Tutorial passo a passo para configurar e realizar sua primeira auditoria completa.",
      link: "#primeira-auditoria"
    },
    {
      title: "Gerenciando checklists personalizados",
      description: "Aprenda a criar, editar e gerenciar checklists para diferentes tipos de auditoria.",
      link: "#checklists-personalizados"
    },
    {
      title: "Analisando resultados e relatórios",
      description: "Como interpretar gráficos, históricos e extrair insights valiosos dos dados coletados.",
      link: "#analisando-resultados"
    },
    {
      title: "Administrando usuários e permissões",
      description: "Guia completo para gerenciar usuários, perfis e permissões de acesso ao sistema.",
      link: "#usuarios-permissoes"
    }
  ];
  
  const videos = [
    {
      title: "Tour completo do AudTI",
      duration: "15:24",
      thumbnail: "bg-audti-light",
      link: "#video-tour"
    },
    {
      title: "Como realizar uma auditoria eficiente",
      duration: "08:37",
      thumbnail: "bg-audti-light",
      link: "#video-auditoria"
    },
    {
      title: "Dicas avançadas para administradores",
      duration: "12:53",
      thumbnail: "bg-audti-light",
      link: "#video-dicas"
    },
    {
      title: "Integrações com sistemas corporativos",
      duration: "09:41",
      thumbnail: "bg-audti-light",
      link: "#video-integracoes"
    }
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Chamado enviado com sucesso!",
      description: "Nossa equipe de suporte entrará em contato em breve.",
    });
  };

  const filteredFaqs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-audti-primary to-audti-accent py-16 text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Central de Suporte AudTI</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Encontre respostas para suas dúvidas, tutoriais e recursos para aproveitar ao máximo o sistema de auditoria.
            </p>
            
            <div className="mt-8 max-w-md mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white/60" />
              </div>
              <Input 
                type="text" 
                placeholder="Buscar ajuda..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus-visible:ring-white"
              />
            </div>
          </div>
        </section>
        
        {/* Content Tabs */}
        <section className="py-12 container mx-auto px-4 md:px-6">
          <Tabs defaultValue="faqs" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="tutorials">Tutoriais</TabsTrigger>
              <TabsTrigger value="videos">Vídeos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="faqs" className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-6">Perguntas Frequentes</h2>
              
              {searchQuery && filteredFaqs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-audti-gray text-lg">Nenhum resultado encontrado para "{searchQuery}"</p>
                  <p className="mt-2">Tente outro termo ou abra um chamado para nossa equipe.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <div key={index} className="bg-white border border-audti-light rounded-lg p-4 shadow-sm">
                      <h3 className="text-lg font-semibold text-audti-primary mb-2">{faq.question}</h3>
                      <p className="text-audti-gray">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tutorials" className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-6">Tutoriais e Guias</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {tutorials.map((tutorial, index) => (
                  <a 
                    href={tutorial.link} 
                    key={index}
                    className="bg-white border border-audti-light rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="h-10 w-10 rounded-full bg-audti-secondary/20 flex items-center justify-center mb-4">
                      <span className="text-audti-secondary font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-audti-primary mb-2">{tutorial.title}</h3>
                    <p className="text-audti-gray mb-4">{tutorial.description}</p>
                    <div className="mt-auto text-audti-secondary font-medium hover:underline">
                      Acessar tutorial →
                    </div>
                  </a>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="videos" className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-6">Vídeos de Treinamento</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {videos.map((video, index) => (
                  <a 
                    href={video.link} 
                    key={index}
                    className="bg-white border border-audti-light rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className={`${video.thumbnail} h-40 relative flex items-center justify-center`}>
                      <div className="w-14 h-14 rounded-full bg-audti-primary/90 flex items-center justify-center">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-audti-primary">{video.title}</h3>
                    </div>
                  </a>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
        
        {/* Support Ticket */}
        <section className="py-12 bg-audti-light">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-center mb-6">Não encontrou o que precisa?</h2>
              <p className="text-center text-audti-gray mb-8">
                Nossa equipe de suporte está pronta para ajudar. Preencha o formulário abaixo para abrir um chamado.
              </p>
              
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-audti-primary mb-1">Nome</label>
                    <Input id="name" placeholder="Seu nome completo" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-audti-primary mb-1">Email</label>
                    <Input id="email" type="email" placeholder="seu.email@brasal.com.br" required />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-audti-primary mb-1">Assunto</label>
                  <Input id="subject" placeholder="Descreva brevemente o assunto" required />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-audti-primary mb-1">Descrição</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="Descreva detalhadamente sua dúvida ou problema" 
                    required
                  ></textarea>
                </div>
                
                <div className="pt-2 text-center">
                  <CTAButton type="submit" variant="primary" size="lg">
                    Enviar Chamado
                  </CTAButton>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default SupportPortal;
