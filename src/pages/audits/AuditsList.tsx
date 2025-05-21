
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { useAuditorias, AuditoriaFilters as AuditoriaFiltersType } from '@/hooks/useAuditorias';
import { Plus, Trash2, FileText } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import AuditoriaFiltersComponent from '@/components/audits/AuditoriaFilters';
import AuditoriaPagination from '@/components/audits/AuditoriaPagination';
import { auditoriaService } from '@/services/auditoriaService';

const AuditsList = () => {
  const navigate = useNavigate();
  const { deleteAuditoria, isLoading: isDeleting } = useAuditorias();
  const [auditToDelete, setAuditToDelete] = useState<string | null>(null);
  const { user } = useAuth();
  
  const [filters, setFilters] = useState<AuditoriaFiltersType>({
    pagina: 1,
    itensPorPagina: 10,
    ordenacao: { campo: 'data', ordem: 'desc' }
  });
  
  // Buscar auditorias com filtros
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['auditoriasList', filters],
    queryFn: () => auditoriaService.getAll(filters)
  });
  
  const auditorias = data?.auditorias || [];
  const totalItems = data?.count || 0;
  
  // Calcula a média de notas dos critérios para cada auditoria
  const getMediaNotas = (criterios: any[]) => {
    if (!criterios || criterios.length === 0) return "N/A";
    
    const somaNotas = criterios.reduce((acc, criterio) => {
      return acc + (criterio.nota || 0);
    }, 0);
    
    return (somaNotas / criterios.length).toFixed(1);
  };

  // Formatar data para exibição
  const formatarData = (dataString?: string) => {
    if (!dataString) return "Data não informada";
    
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };
  
  const handleDeleteConfirm = async () => {
    if (auditToDelete) {
      await deleteAuditoria.mutateAsync(auditToDelete);
      setAuditToDelete(null);
      refetch();
    }
  };
  
  const handleDeleteCancel = () => {
    setAuditToDelete(null);
  };
  
  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      pagina: page
    }));
  };
  
  const handleFilterChange = (newFilters: AuditoriaFiltersType) => {
    setFilters(newFilters);
  };
  
  // Renderizar skeletons durante o carregamento
  const renderSkeletons = () => {
    return Array(5).fill(null).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end space-x-2">
            <Skeleton className="h-8 w-8" />
            {user && (
              <>
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </>
            )}
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-audti-primary">Auditorias</h1>
            <p className="text-gray-600">
              {totalItems > 0 ? 
                `${totalItems} auditoria${totalItems !== 1 ? 's' : ''} encontrada${totalItems !== 1 ? 's' : ''}` : 
                'Nenhuma auditoria encontrada'
              }
            </p>
          </div>
          
          {user && (
            <Button 
              onClick={() => navigate('/audits/new')}
              className="bg-audti-primary hover:bg-audti-accent w-full md:w-auto"
            >
              <Plus size={18} className="mr-1" /> Nova Auditoria
            </Button>
          )}
        </div>
        
        {/* Componente de Filtros */}
        <AuditoriaFiltersComponent 
          onFilterChange={handleFilterChange}
          loading={isLoading || isDeleting}
        />
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Auditor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Média</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderSkeletons()}
              </TableBody>
            </Table>
          </div>
        ) : auditorias.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">Nenhuma auditoria encontrada com os filtros selecionados.</p>
            {user && (
              <Button 
                onClick={() => navigate('/audits/new')} 
                className="mt-4 bg-audti-primary hover:bg-audti-accent"
              >
                <Plus size={18} className="mr-1" /> Criar Primeira Auditoria
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Auditor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Média</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditorias.map((audit) => (
                  <TableRow key={audit.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{audit.titulo}</TableCell>
                    <TableCell>{audit.auditor}</TableCell>
                    <TableCell>{formatarData(audit.data)}</TableCell>
                    <TableCell>{getMediaNotas(audit.criterios)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/reports/${audit.id}`)}
                        title="Ver relatório"
                      >
                        <FileText size={16} />
                      </Button>
                      
                      {user && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/audits/${audit.id}`)}
                            title="Editar auditoria"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setAuditToDelete(audit.id)}
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                            title="Excluir auditoria"
                            disabled={isDeleting}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Componente de Paginação */}
            <div className="p-4 border-t">
              <AuditoriaPagination
                currentPage={filters.pagina}
                totalItems={totalItems}
                itemsPerPage={filters.itensPorPagina}
                onPageChange={handlePageChange}
                loading={isLoading || isDeleting}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Dialog de confirmação para exclusão */}
      <AlertDialog open={!!auditToDelete} onOpenChange={() => setAuditToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Esta auditoria será permanentemente removida do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default AuditsList;
