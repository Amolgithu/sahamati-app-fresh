import React, { useState } from 'react';

export default function LoginPage({ onLoginSuccess, onShowRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setStatusMessage('Logging in...');

    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed.');

      // Store the token for future sessions (optional but good practice)
      localStorage.setItem('token', data.token);
      onLoginSuccess(data.user);

    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container home-page">
      <form onSubmit={handleLogin} className="dao-form card">
        <h2 className="form-title">User Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Login'}
        </button>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
        <p className="form-switch">
          Don't have an account? <button type="button" onClick={onShowRegister} className="link-button">Register here</button>
        </p>
      </form>
    </div>
  );
}