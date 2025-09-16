// Settings.js
import React, { useState } from 'react';
import './App.css';

export default function Settings() {
  const [role, setRole] = useState('Admin'); // Replace with actual role logic if available
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('New password and confirm password do not match.');
      return;
    }

    // TODO: Implement actual password change logic here
    setMessage('Password updated successfully.');
  };

  return (
    <div className="settings-container">
      <h2>Profile Settings</h2>

      <div className="setting-item">
        <label>Assigned Role:</label>
        <input type="text" value={role} disabled />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="setting-item">
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className="setting-item">
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="setting-item">
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {message && (
          <p className={message.includes('successfully') ? 'success' : 'error'}>
            {message}
          </p>
        )}

        <button type="submit" className="submit-button">
          Update Password
        </button>
      </form>
    </div>
  );
}
