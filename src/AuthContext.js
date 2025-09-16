// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (username, password) => {
    const usersStr = localStorage.getItem('users');
    if (!usersStr) return { success: false, message: 'No users registered' };

    const users = JSON.parse(usersStr);
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
      setUser(foundUser);
      return { success: true };
    }
    return { success: false, message: 'Invalid username or password' };
  };

  const signup = (username, password) => {
    let users = [];
    const usersStr = localStorage.getItem('users');
    if (usersStr) users = JSON.parse(usersStr);

    if (users.find(u => u.username === username)) {
      return { success: false, message: 'Username already exists' };
    }

    const newUser = { username, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}
