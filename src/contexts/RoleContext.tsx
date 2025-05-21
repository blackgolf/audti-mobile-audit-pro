
import React, { createContext, useContext, useEffect, useState } from 'react';
import { usuarioService, Usuario } from '@/services/usuarioService';
import { useAuth } from '@/contexts/AuthContext';

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

  const isAdmin = usuario?.papel === "administrador" && usuario?.ativo;
  const isAuditor = usuario?.papel === "auditor" && usuario?.ativo;
  const isActive = usuario?.ativo || false;

  const fetchUsuario = async () => {
    if (!user) {
      setUsuario(null);
      return;
    }

    try {
      const usuarioData = await usuarioService.buscarUsuarioAtual();
      setUsuario(usuarioData);
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      setUsuario(null);
    }
  };

  const refreshUsuario = async () => {
    setLoading(true);
    await fetchUsuario();
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading) {
      fetchUsuario().then(() => setLoading(false));
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
