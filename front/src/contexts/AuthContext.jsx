import { createContext, useContext, useState, useEffect } from 'react';
import {login, logout} from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    token: null,

    signIn: (email, password) => {
      const token = login(email, password);
      if (token) {
        setAuthState((prevState) => ({
          ...prevState,
          isLoggedIn: true,
          token,
        }));
      }
    },

    signOut: () => {
      logout();
      setAuthState((prevState) => ({
        ...prevState,
        isLoggedIn: false,
        token: null,
      }));
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthState((prevState) => ({
        ...prevState,
        isLoggedIn: true,
        token,
      }));
    }
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  )
}