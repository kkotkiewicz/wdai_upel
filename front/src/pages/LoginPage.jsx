import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const { signIn, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async () => {
    await signIn(userEmail, userPassword);
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);


  return (
    <div className="login-page">
      <div className='login-form'>
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />
        <button onClick={onSubmit}>Login</button>
      </div>
    </div>
  )
}

export default LoginPage