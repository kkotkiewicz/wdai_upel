import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const AuthGuardComponent = ({children}) => {
  const {isLoggedIn} = useAuth();
  const navigate = useNavigate();

  // need to fix it, bc even if user is logged in still cant access the page
  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn, navigate])

  return <>{children}</>
};