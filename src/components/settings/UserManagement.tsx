
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuarioService, Usuario, UsuarioFormData } from '@/services/usuarioService';
import UserTable from './UserTable';
import UserForm from './UserForm';
import PasswordResetDialog from './PasswordResetDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, RefreshCcw, AlertTriangle, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';

const UserManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'ativo' | 'inativo'>('todos');
  const [filterRole, setFilterRole] = useState<'todos' | 'administrador' | 'auditor'>('todos');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);

  // Queries
  const { 
    data: usuarios = [], 
    isLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ['usuarios'],
    queryFn: usuarioService.listarUsuarios,
  });

  // Filtrar usuários
  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = searchTerm === '' || 
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'todos' || 
      (filterStatus === 'ativo' && usuario.ativo) ||
      (filterStatus === 'inativo' && !usuario.ativo);
    
    const matchesRole = filterRole === 'todos' || 
      usuario.papel === filterRole;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: UsuarioFormData) => usuarioService.criarUsuario(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast({
        title: "Usuário criado",
        description: "O usuário foi criado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Ocorreu um erro ao criar o usuário.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UsuarioFormData }) => 
      usuarioService.atualizarUsuario(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast({
        title: "Usuário atualizado",
        description: "O usuário foi atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar usuário",
        description: error.message || "Ocorreu um erro ao atualizar o usuário.",
        variant: "destructive",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, senha }: { id: string; senha?: string }) => 
      usuarioService.resetarSenha(id, senha),
    onError: (error: any) => {
      toast({
        title: "Erro ao resetar senha",
        description: error.message || "Ocorreu um erro ao resetar a senha.",
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => 
      usuarioService.alterarStatusUsuario(id, ativo),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast({
        title: data.ativo ? "Usuário ativado" : "Usuário desativado",
        description: `O usuário foi ${data.ativo ? "ativado" : "desativado"} com sucesso.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao alterar status",
        description: error.message || "Ocorreu um erro ao alterar o status do usuário.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usuarioService.excluirUsuario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir usuário",
        description: error.message || "Ocorreu um erro ao excluir o usuário.",
        variant: "destructive",
      });
    },
  });

  // Handlers
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setIsFormOpen(true);
  };

  const handleResetPassword = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setIsResetOpen(true);
  };

  const handleToggleActive = (usuario: Usuario, ativo: boolean) => {
    toggleActiveMutation.mutate({ id: usuario.id, ativo });
  };

  const handleDeleteUser = (usuario: Usuario) => {
    setUserToDelete(usuario);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleSubmitForm = async (data: UsuarioFormData) => {
    if (selectedUser) {
      // Editar
      await updateMutation.mutateAsync({ id: selectedUser.id, data });
    } else {
      // Criar novo
      await createMutation.mutateAsync(data);
    }
    setIsFormOpen(false);
  };

  const handleResetSubmit = async (id: string, senha?: string) => {
    return await resetPasswordMutation.mutateAsync({ id, senha });
  };

  const isFormLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-1 items-center space-x-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Input
                  placeholder="Buscar usuário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => refetchUsers()} 
                title="Atualizar lista"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex justify-between w-full sm:w-auto gap-2">
              <div className="flex gap-2">
                <Select
                  value={filterStatus}
                  onValueChange={(value: any) => setFilterStatus(value)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ativo">Ativos</SelectItem>
                    <SelectItem value="inativo">Inativos</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filterRole}
                  onValueChange={(value: any) => setFilterRole(value)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Papel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="administrador">Administradores</SelectItem>
                    <SelectItem value="auditor">Auditores</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddUser} className="bg-audti-primary hover:bg-audti-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Usuário
              </Button>
            </div>
          </div>

          <UserTable
            usuarios={filteredUsuarios}
            onEdit={handleEditUser}
            onResetPassword={handleResetPassword}
            onToggleActive={handleToggleActive}
            onDelete={handleDeleteUser}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Form dialog */}
      <UserForm
        usuario={selectedUser || undefined}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitForm}
        isLoading={isFormLoading}
      />

      {/* Password reset dialog */}
      <PasswordResetDialog
        usuario={selectedUser}
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onReset={handleResetSubmit}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex items-center space-x-2 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
                <span>Esta ação não pode ser desfeita.</span>
              </div>
              <p className="mt-2">
                Tem certeza que deseja excluir o usuário "{userToDelete?.nome}"?
              </p>
              <p className="mt-2">
                Em vez disso, considere desativar o usuário. 
                Isso manterá o histórico do usuário e permitirá reativá-lo no futuro se necessário.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive hover:bg-destructive/90"
              onClick={confirmDeleteUser}
            >
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
