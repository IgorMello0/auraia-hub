import React, { createContext, useContext, useState, useEffect } from 'react';
import { professionalsApi } from '@/lib/api';

interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
}

interface AuthContextType {
  professional: Professional | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  signup: (data: Omit<Professional, 'id'> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão armazenada
    const savedProfessional = localStorage.getItem('professional');
    const savedToken = localStorage.getItem('token');
    
    if (savedProfessional && savedToken) {
      try {
        setProfessional(JSON.parse(savedProfessional));
      } catch (error) {
        // Se houver erro ao parsear, limpar dados inválidos
        localStorage.removeItem('professional');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      console.log('[Auth] Attempting login for:', email);
      const response = await professionalsApi.login(email, password);
      console.log('[Auth] Login response:', response);
      
      if (response.success && response.data) {
        const { token, professional: profData } = response.data;
        
        if (!profData || !token) {
          console.error('[Auth] Missing data in response:', response);
          setIsLoading(false);
          return { 
            success: false, 
            error: 'Resposta inválida do servidor. Tente novamente.' 
          };
        }
        
        const professionalData: Professional = {
          id: profData.id.toString(),
          name: profData.name,
          email: profData.email,
          phone: profData.phone || '',
          specialization: profData.specialization || ''
        };
        
        setProfessional(professionalData);
        localStorage.setItem('professional', JSON.stringify(professionalData));
        localStorage.setItem('token', token);
        setIsLoading(false);
        console.log('[Auth] Login successful');
        return { success: true };
      }
      
      console.error('[Auth] Login failed:', response.error);
      setIsLoading(false);
      return { 
        success: false, 
        error: response.error?.message || 'Erro ao fazer login. Verifique suas credenciais.' 
      };
    } catch (error) {
      console.error('[Auth] Login exception:', error);
      setIsLoading(false);
      return { 
        success: false, 
        error: 'Erro de conexão. Verifique se o servidor está rodando e tente novamente.' 
      };
    }
  };

  const signup = async (data: Omit<Professional, 'id'> & { password: string }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      console.log('[Auth] Attempting signup for:', data.email);
      const response = await professionalsApi.signup({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        specialization: data.specialization
      });
      console.log('[Auth] Signup response:', response);
      
      if (response.success && response.data) {
        const { token, professional: profData } = response.data;
        
        if (!profData || !token) {
          console.error('[Auth] Missing data in response:', response);
          setIsLoading(false);
          return { 
            success: false, 
            error: 'Resposta inválida do servidor. Tente novamente.' 
          };
        }
        
        const professionalData: Professional = {
          id: profData.id.toString(),
          name: profData.name,
          email: profData.email,
          phone: profData.phone || '',
          specialization: profData.specialization || ''
        };
        
        setProfessional(professionalData);
        localStorage.setItem('professional', JSON.stringify(professionalData));
        localStorage.setItem('token', token);
        setIsLoading(false);
        console.log('[Auth] Signup successful');
        return { success: true };
      }
      
      console.error('[Auth] Signup failed:', response.error);
      setIsLoading(false);
      return { 
        success: false, 
        error: response.error?.message || 'Erro ao criar conta. Tente novamente mais tarde.' 
      };
    } catch (error) {
      console.error('[Auth] Signup exception:', error);
      setIsLoading(false);
      return { 
        success: false, 
        error: 'Erro de conexão. Verifique se o servidor está rodando e tente novamente.' 
      };
    }
  };

  const logout = () => {
    setProfessional(null);
    localStorage.removeItem('professional');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{
      professional,
      login,
      logout,
      signup,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}