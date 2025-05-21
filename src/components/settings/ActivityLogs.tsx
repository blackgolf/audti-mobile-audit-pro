
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { usuarioService } from '@/services/usuarioService';
import LogsTable from './LogsTable';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

const ActivityLogs: React.FC = () => {
  const { 
    data: logs = [], 
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['logs'],
    queryFn: () => usuarioService.listarLogs(),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Registro de Atividades</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()} 
          title="Atualizar logs"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>
      <LogsTable logs={logs} isLoading={isLoading} />
    </div>
  );
};

export default ActivityLogs;
