import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  moduleCode?: string; // Opcional: se fornecido, verifica permissão do módulo
}

export function ProtectedRoute({ children, moduleCode }: ProtectedRouteProps) {
  const { professional, hasModuleAccess, permissions, isLoading } = useAuth();

  // Aguardar carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não está autenticado, redirecionar para login
  if (!professional) {
    return <Navigate to="/login" replace />;
  }

  // Se um módulo foi especificado, verificar permissão
  if (moduleCode) {
    // Aguardar permissões serem carregadas
    if (permissions.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    // Verificar se tem acesso ao módulo
    if (!hasModuleAccess(moduleCode)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-6xl">🔒</div>
            <h1 className="text-2xl font-bold">Acesso Negado</h1>
            <p className="text-muted-foreground">
              Você não tem permissão para acessar este módulo do sistema.
            </p>
            <p className="text-sm text-muted-foreground">
              Entre em contato com o administrador para solicitar acesso.
            </p>
            <a 
              href="/dashboard" 
              className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Voltar ao Dashboard
            </a>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

