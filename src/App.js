// src/App.js
import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import Login from './Login';
import MealManagement from './MealManagement';
import SelectContributors from './SelectContributors';
import Settings from './Settings';
import './App.css';

export default function App() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('meal'); // default tab

  if (!user) {
    // Show login if no user logged in
    return <Login />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Side Navigation */}
      <nav className="side-nav">
        <h2>Menu</h2>
        <ul>
          <li>
            <button
              onClick={() => setActiveTab('meal')}
              style={{
                background: activeTab === 'meal' ? '#3182ce' : 'transparent',
                color: activeTab === 'meal' ? 'white' : '#3182ce',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
            >
              Register Meal Form
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('contributors')}
              style={{
                background: activeTab === 'contributors' ? '#3182ce' : 'transparent',
                color: activeTab === 'contributors' ? 'white' : '#3182ce',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
            >
              Select Contributors
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('settings')}
              style={{
                background: activeTab === 'settings' ? '#3182ce' : 'transparent',
                color: activeTab === 'settings' ? 'white' : '#3182ce',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
            >
              Settings
            </button>
          </li>
        </ul>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </nav>

      {/* Main content */}
      <main className="main-content">
        {activeTab === 'meal' && <MealManagement />}
        {activeTab === 'contributors' && <SelectContributors />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}
