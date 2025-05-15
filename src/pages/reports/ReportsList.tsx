
import React, { useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Search, Filter, Download } from 'lucide-react';

const ReportsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock reports data
  const reports = [
    { 
      id: 1, 
      unit: 'Brasal Refrigerantes - Matriz', 
      date: '15/05/2025', 
      score: 4.8, 
      technician: 'Carlos Silva',
      previousScore: 4.3,
      change: 0.5
    },
    { 
      id: 2, 
      unit: 'Brasal Combustíveis - Asa Norte', 
      date: '14/05/2025', 
      score: 3.9, 
      technician: 'Ana Santos',
      previousScore: 4.1,
      change: -0.2
    },
    { 
      id: 3, 
      unit: 'Brasal Veículos - Taguatinga', 
      date: '12/05/2025', 
      score: 4.5, 
      technician: 'Roberto Alves',
      previousScore: 4.2,
      change: 0.3
    },
    { 
      id: 4, 
      unit: 'Brasal Incorporações - Sede', 
      date: '10/05/2025', 
      score: 3.2, 
      technician: 'Mariana Costa',
      previousScore: 3.0,
      change: 0.2
    },
    { 
      id: 5, 
      unit: 'Brasal Refrigerantes - Gama', 
      date: '08/05/2025', 
      score: 4.0, 
      technician: 'Carlos Silva',
      previousScore: 3.8,
      change: 0.2
    },
    { 
      id: 6, 
      unit: 'Brasal Combustíveis - Sudoeste', 
      date: '05/05/2025', 
      score: 4.6, 
      technician: 'Ana Santos',
      previousScore: 4.4,
      change: 0.2
    },
  ];

  // Filter reports based on search term
  const filteredReports = searchTerm 
    ? reports.filter(report => 
        report.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.technician.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : reports;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Relatórios de Auditoria</h1>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Exportar Todos
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Lista de Relatórios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por unidade ou técnico..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" /> Filtrar
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unidade
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Técnico
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nota
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variação
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.technician}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {report.score.toFixed(1)} / 5
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          report.change > 0 
                            ? 'text-green-600' 
                            : report.change < 0 
                              ? 'text-red-600' 
                              : 'text-gray-500'
                        }`}>
                          {report.change > 0 ? '+' : ''}{report.change.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          to={`/reports/${report.id}`} 
                          className="text-audti-secondary hover:text-audti-primary"
                        >
                          Visualizar
                        </Link>
                        <span className="mx-2 text-gray-300">|</span>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-audti-secondary hover:text-audti-primary"
                        >
                          Baixar PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredReports.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum relatório encontrado.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ReportsList;
