
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppLayout from '@/components/layouts/AppLayout';
import { useAuditorias } from '@/hooks/useAuditorias';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Edit, Printer } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const AuditReport = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAuditoria } = useAuditorias();
  const { data: auditoria, isLoading, error } = getAuditoria(id || '');

  // Função para formatar a data
  const formatarData = (dataString?: string) => {
    if (!dataString) return 'N/A';
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch (error) {
      return dataString;
    }
  };

  // Função para calcular a média das notas
  const calcularMediaNotas = () => {
    if (!auditoria?.criterios || auditoria.criterios.length === 0) {
      return 'N/A';
    }
    
    const somaNotas = auditoria.criterios.reduce((acc, criterio) => 
      acc + (criterio.nota || 0), 0
    );
    
    return (somaNotas / auditoria.criterios.length).toFixed(1);
  };

  // Função para imprimir o relatório
  const imprimirRelatorio = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p>Carregando auditoria...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !auditoria) {
    return (
      <AppLayout>
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-4">Auditoria não encontrada</h2>
          <p className="mb-4">Não foi possível carregar os detalhes desta auditoria.</p>
          <Button asChild>
            <Link to="/audits">Voltar para a lista</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 print:mx-8">
        <div className="flex justify-between items-center print:hidden">
          <Button variant="outline" onClick={() => navigate('/audits')}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={imprimirRelatorio}>
              <Printer className="h-4 w-4 mr-2" /> Imprimir
            </Button>
            <Button asChild>
              <Link to={`/audits/${id}`}>
                <Edit className="h-4 w-4 mr-2" /> Editar
              </Link>
            </Button>
          </div>
        </div>

        <div className="print:py-8">
          <h1 className="text-3xl font-bold text-center mb-2">{auditoria.titulo}</h1>
          <p className="text-center text-gray-500">Relatório de Auditoria</p>
          <p className="text-center text-gray-500">Data: {formatarData(auditoria.data)}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p className="text-sm font-semibold text-gray-500">Auditor</p>
                <p className="text-lg">{auditoria.auditor}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Data</p>
                <p className="text-lg">{formatarData(auditoria.data)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Nota Média</p>
                <p className="text-lg font-bold">{calcularMediaNotas()} <span className="text-sm text-gray-500">/ 5</span></p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Áreas</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {auditoria.areas.map((area, index) => (
                    <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-100">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {auditoria.descricao && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-500">Descrição</p>
                <p className="mt-1">{auditoria.descricao}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Critérios Avaliados</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: '40%' }}>Descrição</TableHead>
                  <TableHead style={{ width: '10%' }}>Nota</TableHead>
                  <TableHead style={{ width: '50%' }}>Justificativa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditoria.criterios.map((criterio, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{criterio.descricao}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white
                          ${criterio.nota >= 4 ? 'bg-green-500' : 
                            criterio.nota >= 3 ? 'bg-yellow-500' : 
                            criterio.nota >= 2 ? 'bg-orange-500' : 'bg-red-500'}`
                        }>
                          {criterio.nota}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{criterio.justificativa}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Resumo da Avaliação</h3>
              <div className="flex items-center">
                <div className="h-4 w-full bg-gray-200 rounded-full">
                  <div 
                    className={`h-full rounded-full ${
                      parseFloat(calcularMediaNotas()) >= 4 ? 'bg-green-500' : 
                      parseFloat(calcularMediaNotas()) >= 3 ? 'bg-yellow-500' : 
                      parseFloat(calcularMediaNotas()) >= 2 ? 'bg-orange-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${(parseFloat(calcularMediaNotas()) / 5) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-4 font-bold">{calcularMediaNotas()}/5</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="p-4 border rounded-md text-center">
                  <p className="text-sm text-gray-500">Total de Critérios</p>
                  <p className="text-xl font-bold">{auditoria.criterios.length}</p>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <p className="text-sm text-gray-500">Critérios Satisfatórios</p>
                  <p className="text-xl font-bold">
                    {auditoria.criterios.filter(c => c.nota >= 3).length}
                  </p>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <p className="text-sm text-gray-500">Critérios Críticos</p>
                  <p className="text-xl font-bold">
                    {auditoria.criterios.filter(c => c.nota <= 2).length}
                  </p>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <p className="text-sm text-gray-500">Nota Média</p>
                  <p className="text-xl font-bold">{calcularMediaNotas()}/5</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="print:mt-8">
          <p className="text-center text-sm text-gray-500 py-4">
            Relatório gerado pelo sistema AUDTI em {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Espaçador para dar margem quando imprimir */}
        <div className="h-20 print:hidden"></div>
      </div>
    </AppLayout>
  );
};

export default AuditReport;
