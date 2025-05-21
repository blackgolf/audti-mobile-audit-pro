
import React from 'react';
import { LogAtividade } from '@/services/usuarioService';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ClipboardList } from 'lucide-react';

interface LogsTableProps {
  logs: LogAtividade[];
  isLoading?: boolean;
}

const LogsTable: React.FC<LogsTableProps> = ({ logs, isLoading = false }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Ação</TableHead>
            <TableHead>Detalhes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                {isLoading ? "Carregando logs..." : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <ClipboardList className="h-12 w-12 mb-2" />
                    <p>Nenhum log de atividade encontrado</p>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {format(new Date(log.criado_em), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
                </TableCell>
                <TableCell>
                  {log.usuario_nome}
                </TableCell>
                <TableCell>
                  {log.acao}
                </TableCell>
                <TableCell>
                  {log.detalhes && (
                    <pre className="text-xs whitespace-pre-wrap max-w-xs max-h-20 overflow-auto">
                      {JSON.stringify(log.detalhes, null, 2)}
                    </pre>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LogsTable;
