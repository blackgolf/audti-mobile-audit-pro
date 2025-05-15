
import React from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight, Activity, Award, Check, Clock } from 'lucide-react';

const Dashboard = () => {
  // Mock data for dashboard stats
  const stats = [
    { 
      title: 'Auditorias Concluídas',
      value: 127,
      icon: <Check className="h-8 w-8 text-green-500" />,
      color: 'bg-green-50'
    },
    { 
      title: 'Auditorias em Progresso',
      value: 9,
      icon: <Clock className="h-8 w-8 text-yellow-500" />,
      color: 'bg-yellow-50'
    },
    { 
      title: 'Média de Avaliação',
      value: '4.2 / 5',
      icon: <Award className="h-8 w-8 text-audti-secondary" />,
      color: 'bg-blue-50'
    },
    { 
      title: 'Total de Unidades',
      value: 42,
      icon: <Activity className="h-8 w-8 text-audti-primary" />,
      color: 'bg-indigo-50'
    },
  ];

  // Mock data for recent audits
  const recentAudits = [
    { id: 1, unit: 'Brasal Refrigerantes - Matriz', date: '15/05/2025', score: 4.8, technician: 'Carlos Silva' },
    { id: 2, unit: 'Brasal Combustíveis - Asa Norte', date: '14/05/2025', score: 3.9, technician: 'Ana Santos' },
    { id: 3, unit: 'Brasal Veículos - Taguatinga', date: '12/05/2025', score: 4.5, technician: 'Roberto Alves' },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <Button asChild>
            <Link to="/audits/new">Nova Auditoria</Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className={`p-6 ${stat.color}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                  </div>
                  <div>{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Audits */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Auditorias Recentes</CardTitle>
            <CardDescription>Últimas auditorias realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAudits.map((audit) => (
                <div 
                  key={audit.id} 
                  className="flex justify-between items-center p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium">{audit.unit}</h4>
                    <p className="text-sm text-gray-500">
                      {audit.date} • Técnico: {audit.technician}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 font-medium">
                      {audit.score}
                    </span>
                    <Link to={`/reports/${audit.id}`}>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button variant="outline" asChild className="w-full">
                <Link to="/audits">Ver Todas as Auditorias</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
