
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus, Trash2 } from 'lucide-react';
import { useAuditorias } from '@/hooks/useAuditorias';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const AuditsList = () => {
  const { auditorias, deleteAuditoria, refetchAuditorias, isLoading } = useAuditorias();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAuditorias, setFilteredAuditorias] = useState(auditorias);

  // Atualizar a lista filtrada quando as auditorias mudarem ou o termo de busca mudar
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAuditorias(auditorias);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = auditorias.filter(auditoria => 
        auditoria.titulo.toLowerCase().includes(lowerSearchTerm) ||
        auditoria.auditor.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredAuditorias(filtered);
    }
  }, [auditorias, searchTerm]);

  // Função para calcular a média das notas de uma auditoria
  const calcularMediaNotas = (auditoria) => {
    if (!auditoria.criterios || auditoria.criterios.length === 0) {
      return 'N/A';
    }
    
    const somaNotas = auditoria.criterios.reduce((acc, criterio) => 
      acc + (criterio.nota || 0), 0
    );
    
    return (somaNotas / auditoria.criterios.length).toFixed(1);
  };

  // Função para formatar a data
  const formatarData = (dataString) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch (error) {
      return dataString;
    }
  };

  // Função para lidar com a exclusão de uma auditoria
  const handleDelete = async (id) => {
    try {
      await deleteAuditoria.mutateAsync(id);
      toast.success("Auditoria excluída com sucesso");
      refetchAuditorias();
    } catch (error) {
      toast.error("Erro ao excluir auditoria");
      console.error(error);
    }
  };

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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-10">
                <p>Carregando auditorias...</p>
              </div>
            ) : filteredAuditorias.length === 0 ? (
              <div className="text-center py-10">
                <p>Nenhuma auditoria encontrada.</p>
                <Button asChild className="mt-4">
                  <Link to="/audits/new">Criar Nova Auditoria</Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Auditor</TableHead>
                      <TableHead>Áreas</TableHead>
                      <TableHead>Nota</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAuditorias.map((auditoria) => (
                      <TableRow key={auditoria.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{auditoria.titulo}</TableCell>
                        <TableCell>{formatarData(auditoria.data)}</TableCell>
                        <TableCell>{auditoria.auditor}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {auditoria.areas.slice(0, 2).map((area, index) => (
                              <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-100">
                                {area}
                              </span>
                            ))}
                            {auditoria.areas.length > 2 && (
                              <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                                +{auditoria.areas.length - 2}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {calcularMediaNotas(auditoria)} <span className="text-xs text-gray-500">/ 5</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/reports/${auditoria.id}`}>
                                Relatório
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/audits/${auditoria.id}`}>
                                Editar
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir Auditoria</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir esta auditoria? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(auditoria.id)} className="bg-red-500 hover:bg-red-600">
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AuditsList;
