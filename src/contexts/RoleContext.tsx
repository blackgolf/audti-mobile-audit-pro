
import React, { createContext, useContext, useEffect, useState } from 'react';
import { usuarioService, Usuario } from '@/services/usuarioService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface RoleContextType {
  usuario: Usuario | null;
  loading: boolean;
  isAdmin: boolean;
  isAuditor: boolean;
  isActive: boolean;
  refreshUsuario: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  // Check for administrator role and active status
  const isAdmin = usuario?.papel === "administrador" && usuario?.ativo === true;
  const isAuditor = usuario?.papel === "auditor" && usuario?.ativo === true;
  const isActive = usuario?.ativo || false;

  const fetchUsuario = async () => {
    if (!user) {
      setUsuario(null);
      setLoading(false);
      return;
    }

    try {
      const usuarioData = await usuarioService.buscarUsuarioAtual();
      console.log("Usuario data loaded:", usuarioData); // Debug log
      setUsuario(usuarioData);
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      setUsuario(null);
      // Show a toast notification for the error
      toast.error("Não foi possível carregar os dados do usuário.");
    } finally {
      setLoading(false);
    }
  };

  const refreshUsuario = async () => {
    setLoading(true);
    await fetchUsuario();
  };

  useEffect(() => {
    // Only fetch user data once auth is loaded and when user changes
    if (!authLoading) {
      fetchUsuario();
    }
  }, [user, authLoading]);

  return (
    <RoleContext.Provider
      value={{
        usuario,
        loading: loading || authLoading,
        isAdmin,
        isAuditor,
        isActive,
        refreshUsuario
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
