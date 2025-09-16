// src/Login.js
import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import './Login.css';

export default function Login() {
  const { login, signup } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const result = login(username.trim(), password);
      if (!result.success) {
        setError(result.message);
      }
    } else {
      const result = signup(username.trim(), password);
      if (!result.success) {
        setError(result.message);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="logo-placeholder">SBV</div>
      <h1 className="login-title">{isLogin ? 'Login' : 'Sign Up'}</h1>
      {error && <div className="error-message">{error}</div>}
      <form className="login-form" onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="login-button" type="submit">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <button className="link-button" onClick={() => { setError(''); setIsLogin(!isLogin); }}>
        {isLogin ? 'Create an account' : 'Have an account? Login'}
      </button>
    </div>
  );
}
