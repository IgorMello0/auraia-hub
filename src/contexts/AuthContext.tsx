import React, { createContext, useContext, useState, useEffect } from 'react';

interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
}

interface AuthContextType {
  professional: Professional | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (data: Omit<Professional, 'id'> & { password: string }) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular verificação de sessão armazenada
    const savedProfessional = localStorage.getItem('professional');
    if (savedProfessional) {
      setProfessional(JSON.parse(savedProfessional));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock login - removar quando integrar backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'demo@demo.com' && password === 'demo') {
      const mockProfessional: Professional = {
        id: '1',
        name: 'Dr. João Silva',
        email: 'demo@demo.com',
        phone: '+55 11 99999-9999',
        specialization: 'Psicologia'
      };
      
      setProfessional(mockProfessional);
      localStorage.setItem('professional', JSON.stringify(mockProfessional));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (data: Omit<Professional, 'id'> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock signup
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newProfessional: Professional = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      specialization: data.specialization
    };
    
    setProfessional(newProfessional);
    localStorage.setItem('professional', JSON.stringify(newProfessional));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setProfessional(null);
    localStorage.removeItem('professional');
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