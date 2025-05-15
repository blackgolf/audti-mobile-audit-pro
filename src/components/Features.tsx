
import React from 'react';
import { CheckCircle, FileText, Upload, Calendar, Database, Shield } from 'lucide-react';

const featuresData = [
  {
    icon: <CheckCircle className="w-10 h-10 text-audti-secondary" />,
    title: "Checklists Dinâmicos",
    description: "Formulários inteligentes que se adaptam ao contexto da auditoria, com critérios personalizáveis para cada unidade e tipo de infraestrutura."
  },
  {
    icon: <Upload className="w-10 h-10 text-audti-secondary" />,
    title: "Upload de Fotos",
    description: "Captura de evidências visuais diretamente do dispositivo móvel, com organização automática e vinculação aos itens auditados."
  },
  {
    icon: <FileText className="w-10 h-10 text-audti-secondary" />,
    title: "Relatórios Inteligentes",
    description: "Geração automática de relatórios detalhados com histórico visual, comparativos entre períodos e indicadores de evolução."
  },
  {
    icon: <Calendar className="w-10 h-10 text-audti-secondary" />,
    title: "Uso Offline",
    description: "Trabalhe sem conexão durante auditorias em campo e sincronize os dados posteriormente quando houver conexão disponível."
  },
  {
    icon: <Database className="w-10 h-10 text-audti-secondary" />,
    title: "Armazenamento Seguro",
    description: "Dados e imagens armazenados com segurança na nuvem, com criptografia em trânsito e em repouso para total proteção."
  },
  {
    icon: <Shield className="w-10 h-10 text-audti-secondary" />,
    title: "Controle de Acesso",
    description: "Gerenciamento granular de permissões por perfil, garantindo que cada usuário acesse apenas o que é necessário."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-16 bg-audti-light">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Funcionalidades Principais</h2>
          <p className="text-lg text-audti-gray max-w-2xl mx-auto">
            Conheça os recursos que tornam o AudTI a solução ideal para auditorias de TI no grupo Brasal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-audti-primary">{feature.title}</h3>
              <p className="text-audti-gray">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold mb-4 text-audti-primary">Experiência Mobile-First</h3>
              <p className="text-audti-gray mb-4">
                Interface otimizada para uso em campo, permitindo aos técnicos realizar auditorias completas usando apenas smartphones ou tablets, aumentando a produtividade e reduzindo o tempo necessário para cada inspeção.
              </p>
              <ul className="space-y-2">
                {["Interface intuitiva", "Funcionamento offline", "Sincronização automática", "Design responsivo"].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-audti-secondary mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="bg-audti-light h-60 w-32 rounded-2xl flex items-center justify-center">
                <span className="text-audti-gray text-sm">Preview do App</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
