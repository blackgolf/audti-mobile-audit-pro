
import React, { useState } from 'react';
import { Usuario } from '@/services/usuarioService';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pencil, MoreVertical, Key, Power, PowerOff, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UserTableProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onResetPassword: (usuario: Usuario) => void;
  onToggleActive: (usuario: Usuario, ativo: boolean) => void;
  onDelete: (usuario: Usuario) => void;
  isLoading?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ 
  usuarios, 
  onEdit, 
  onResetPassword,
  onToggleActive,
  onDelete,
  isLoading = false
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-audti-primary"></div>
                </div>
                <div className="mt-2 text-sm text-gray-500">Carregando usuários...</div>
              </TableCell>
            </TableRow>
          ) : usuarios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="text-gray-500">Nenhum usuário encontrado</div>
                <div className="text-sm text-gray-400 mt-1">Tente ajustar os filtros ou adicionar um novo usuário</div>
              </TableCell>
            </TableRow>
          ) : (
            usuarios.map((usuario) => (
              <TableRow key={usuario.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{usuario.nome}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>
                  <Badge variant={usuario.papel === 'administrador' ? 'default' : 'secondary'} className="capitalize">
                    {usuario.papel === 'administrador' ? 'Administrador' : 'Auditor'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={usuario.ativo ? 'success' : 'destructive'} className="capitalize">
                    {usuario.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(usuario.criado_em), 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(usuario)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onResetPassword(usuario)}>
                        <Key className="mr-2 h-4 w-4" />
                        Resetar senha
                      </DropdownMenuItem>
                      {usuario.ativo ? (
                        <DropdownMenuItem onClick={() => onToggleActive(usuario, false)}>
                          <PowerOff className="mr-2 h-4 w-4" />
                          Desativar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onToggleActive(usuario, true)}>
                          <Power className="mr-2 h-4 w-4" />
                          Ativar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => onDelete(usuario)}
                        className="text-red-600 hover:text-red-700 focus:text-red-700"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
