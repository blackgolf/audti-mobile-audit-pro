
import React from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Printer, Share2 } from 'lucide-react';
import { ChartContainer, ChartLegend } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for historical audit scores
const historicalData = [
  { month: 'Jan', score: 3.7 },
  { month: 'Fev', score: 3.9 },
  { month: 'Mar', score: 4.1 },
  { month: 'Abr', score: 3.8 },
  { month: 'Mai', score: 4.3 },
  { month: 'Jun', score: 4.8 },
];

// Mock category scores
const categoryScores = [
  { category: 'Infraestrutura', score: 4.5 },
  { category: 'Segurança', score: 4.8 },
  { category: 'Sistemas', score: 5.0 },
];

// Mock checklist items with details
const completedChecklist = {
  Infraestrutura: [
    { 
      id: 101, 
      question: 'Os switches estão devidamente instalados e documentados?', 
      score: 4,
      observation: 'Switches bem organizados, mas falta documentação de algumas portas.',
      actionPlan: 'Criar diagrama de rede e documentar todas as portas dos switches.',
      photos: [
        'https://picsum.photos/seed/101-1/300/200',
        'https://picsum.photos/seed/101-2/300/200',
      ]
    },
    { 
      id: 102, 
      question: 'O cabeamento de rede está organizado e identificado?', 
      score: 5,
      observation: 'Cabeamento muito bem organizado e identificado.',
      actionPlan: '',
      photos: [
        'https://picsum.photos/seed/102-1/300/200',
      ]
    },
    { 
      id: 103, 
      question: 'O rack está limpo e bem organizado?', 
      score: 4,
      observation: 'Rack bem organizado, mas precisa de limpeza.',
      actionPlan: 'Agendar limpeza do rack no próximo mês.',
      photos: [
        'https://picsum.photos/seed/103-1/300/200',
      ]
    },
    { 
      id: 104, 
      question: 'O sistema de refrigeração está funcionando adequadamente?', 
      score: 5,
      observation: 'Temperatura ideal, ar condicionado funcionando perfeitamente.',
      actionPlan: '',
      photos: [
        'https://picsum.photos/seed/104-1/300/200',
      ]
    },
  ],
  Segurança: [
    { 
      id: 201, 
      question: 'Os servidores possuem antivírus atualizado?', 
      score: 5,
      observation: 'Antivírus atualizados e funcionando em todos os servidores.',
      actionPlan: '',
      photos: []
    },
    { 
      id: 202, 
      question: 'O firewall está configurado corretamente?', 
      score: 5,
      observation: 'Configuração de firewall atualizada e regras bem definidas.',
      actionPlan: '',
      photos: []
    },
    { 
      id: 203, 
      question: 'As políticas de backup estão sendo seguidas?', 
      score: 4,
      observation: 'Backups sendo realizados diariamente, mas o teste de restauração não é feito com a frequência recomendada.',
      actionPlan: 'Implementar testes de restauração mensais e documentar os resultados.',
      photos: []
    },
    { 
      id: 204, 
      question: 'O controle de acesso à sala de servidores é adequado?', 
      score: 5,
      observation: 'Controle biométrico funcionando corretamente, com registro de acessos.',
      actionPlan: '',
      photos: [
        'https://picsum.photos/seed/204-1/300/200',
      ]
    },
  ],
  Sistemas: [
    { 
      id: 301, 
      question: 'Os sistemas operacionais estão atualizados?', 
      score: 5,
      observation: 'Todos os sistemas com patches de segurança atualizados.',
      actionPlan: '',
      photos: []
    },
    { 
      id: 302, 
      question: 'Os softwares estão licenciados corretamente?', 
      score: 5,
      observation: 'Todas as licenças ativas e documentadas.',
      actionPlan: '',
      photos: []
    },
    { 
      id: 303, 
      question: 'As estações de trabalho possuem as configurações padrão?', 
      score: 5,
      observation: 'Todas as estações seguem o padrão definido pela TI.',
      actionPlan: '',
      photos: []
    },
    { 
      id: 304, 
      question: 'O ERP está funcionando sem erros recorrentes?', 
      score: 5,
      observation: 'Sistema ERP estável, sem registros de erros no último mês.',
      actionPlan: '',
      photos: []
    },
  ]
};

// Mock audit data
const auditData = {
  id: 1,
  unit: 'Brasal Refrigerantes - Matriz',
  date: '15/05/2025',
  technician: 'Carlos Silva',
  overallScore: 4.8,
  previousScore: 4.3,
  categoryScores
};

const AuditReport = () => {
  const { id } = useParams();
  
  // Chart config for colors
  const chartConfig = {
    score: { color: "#3E92CC" },
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Relatório de Auditoria</h1>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" /> Imprimir
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" /> Compartilhar
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" /> Exportar PDF
            </Button>
          </div>
        </div>

        {/* Report Header */}
        <Card className="border-t-4 border-t-audti-primary">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-6 justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Unidade</p>
                  <h3 className="text-lg font-bold">{auditData.unit}</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Data</p>
                  <h3 className="text-lg font-medium">{auditData.date}</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Técnico</p>
                  <h3 className="text-lg font-medium">{auditData.technician}</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Nota</p>
                  <h3 className="text-lg font-bold flex items-center">
                    {auditData.overallScore}
                    <span className="text-sm text-gray-500 mx-1">/5</span>
                    {auditData.previousScore && (
                      <span className={`text-sm ${auditData.overallScore > auditData.previousScore ? 'text-green-500' : 'text-red-500'}`}>
                        ({auditData.overallScore > auditData.previousScore ? '+' : ''}{(auditData.overallScore - auditData.previousScore).toFixed(1)})
                      </span>
                    )}
                  </h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score History Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Histórico de Notas</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historicalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="score" name="Nota" fill="#3E92CC" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Score By Category */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Notas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryScores.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{category.category}</h3>
                    <span className="font-medium">{category.score} / 5</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div 
                      className="h-full bg-audti-secondary rounded-full" 
                      style={{ width: `${(category.score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Report */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Detalhes da Auditoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {Object.entries(completedChecklist).map(([category, items]) => (
                <div key={category} className="space-y-4">
                  <h3 className="font-bold text-lg border-b pb-2">{category}</h3>
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="space-y-4 border-b pb-4">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{item.question}</h4>
                          <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 font-medium">
                            {item.score} / 5
                          </span>
                        </div>
                        
                        {item.observation && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Observação:</p>
                            <p className="text-sm">{item.observation}</p>
                          </div>
                        )}
                        
                        {item.actionPlan && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Plano de Ação:</p>
                            <p className="text-sm">{item.actionPlan}</p>
                          </div>
                        )}
                        
                        {item.photos && item.photos.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-500">Fotos:</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {item.photos.map((photo, index) => (
                                <div 
                                  key={index} 
                                  className="aspect-video bg-gray-100 rounded overflow-hidden"
                                >
                                  <img 
                                    src={photo} 
                                    alt={`Foto ${index + 1}`} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AuditReport;
