
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  requireAuth: boolean;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAuth, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="h-10 w-10 animate-spin text-audti-primary" />
      </div>
    );
  }

  // Se a rota requer autenticação e o usuário não está logado, redirecionar para o login
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Renderizar o conteúdo protegido
  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
