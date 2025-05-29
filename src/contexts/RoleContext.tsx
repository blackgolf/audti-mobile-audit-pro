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
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const { user, loading: authLoading } = useAuth();

  // Check for administrator role and active status
  const isAdmin = usuario?.papel === "administrador" && usuario?.ativo === true;
  const isAuditor = usuario?.papel === "auditor" && usuario?.ativo === true;
  const isActive = usuario?.ativo || false;

  const fetchUsuario = async () => {
    if (!user) {
      setUsuario(null);
      setLoading(false);
      setHasAttemptedLoad(true);
      return;
    }

    try {
      const usuarioData = await usuarioService.buscarUsuarioAtual();
      console.log("Usuario data loaded:", usuarioData); // Debug log
      setUsuario(usuarioData);
    } catch (error: any) {
      console.error("Erro ao carregar dados do usuário:", error);
      setUsuario(null);
      
      // Check for infinite recursion error
      const errorMessage = error?.message || "Não foi possível carregar os dados do usuário.";
      const isRecursionError = errorMessage.includes("infinite recursion detected");
      
      // Show a toast notification for the error
      if (isRecursionError) {
        toast.error("Erro de permissão no banco de dados. Por favor, verifique as políticas de segurança do Supabase.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
      setHasAttemptedLoad(true);
    }
  };

  const refreshUsuario = async () => {
    setLoading(true);
    await fetchUsuario();
  };

  useEffect(() => {
    // Only fetch user data once auth is loaded and when user changes
    // Also prevents infinite loop if we keep getting errors
    if (!authLoading && !hasAttemptedLoad) {
      fetchUsuario();
    }
  }, [user, authLoading, hasAttemptedLoad]);

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
