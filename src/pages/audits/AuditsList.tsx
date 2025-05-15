
import React from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';

const AuditsList = () => {
  // Mock audits data
  const audits = [
    { id: 1, unit: 'Brasal Refrigerantes - Matriz', date: '15/05/2025', score: 4.8, status: 'Concluída', technician: 'Carlos Silva' },
    { id: 2, unit: 'Brasal Combustíveis - Asa Norte', date: '14/05/2025', score: 3.9, status: 'Concluída', technician: 'Ana Santos' },
    { id: 3, unit: 'Brasal Veículos - Taguatinga', date: '12/05/2025', score: 4.5, status: 'Concluída', technician: 'Roberto Alves' },
    { id: 4, unit: 'Brasal Incorporações - Sede', date: '10/05/2025', score: 3.2, status: 'Concluída', technician: 'Mariana Costa' },
    { id: 5, unit: 'Brasal Refrigerantes - Gama', date: '08/05/2025', score: 4.0, status: 'Concluída', technician: 'Carlos Silva' },
    { id: 6, unit: 'Brasal Combustíveis - Sudoeste', date: '05/05/2025', score: 4.6, status: 'Concluída', technician: 'Ana Santos' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Auditorias</h1>
          <Button asChild>
            <Link to="/audits/new"><Plus className="h-4 w-4 mr-2" /> Nova Auditoria</Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Lista de Auditorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar auditorias..."
                  className="pl-8"
                />
              </div>
              <Button variant="outline">Filtrar</Button>
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
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nota
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {audits.map((audit) => (
                    <tr key={audit.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {audit.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {audit.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {audit.technician}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {audit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {audit.score} / 5
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/reports/${audit.id}`} className="text-audti-secondary hover:text-audti-primary">
                          Relatório
                        </Link>
                        <span className="mx-2 text-gray-300">|</span>
                        <Link to={`/audits/${audit.id}`} className="text-audti-secondary hover:text-audti-primary">
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AuditsList;
