import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const authInfos = localStorage.getItem('authInfos');
    if (authInfos) {
      const { token } = JSON.parse(authInfos);
      const verifyToken = async () => {
        try {
          const response = await fetch('/api/verify-token', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            console.log('Token valide');
            setIsAuthenticated(true);
          } else {
            console.error('Token invalide');
            localStorage.removeItem('authInfos');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du token :', error);
          setIsAuthenticated(false);
        } finally {
          setLoading(false); // Set loading to false once verification completes
        }
      };
      verifyToken();
    } else {
      setLoading(false); // No token, skip verification
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    navigate('/');
  };

  const logout = () => {
    setIsAuthenticated(false);
    navigate('/sign-in');
    localStorage.removeItem('authInfos');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
