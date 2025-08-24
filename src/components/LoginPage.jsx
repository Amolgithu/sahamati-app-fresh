import React, { useState } from 'react';

export default function LoginPage({ onLoginSuccess, onShowRegister, isAdmin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Admin (Petra) login
  const handleAdminLogin = async () => {
    setIsLoading(true);
    setStatusMessage('Connecting to Petra...');
    try {
      if (!window.aptos) {
        setStatusMessage('Petra wallet not found!');
        setIsLoading(false);
        return;
      }
      await window.aptos.connect();
      const account = await window.aptos.account();
      // You may want to fetch admin info from backend here
      onLoginSuccess({ wallet_address: account.address });
    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // User login
  const handleUserLogin = async (event) => {
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
      localStorage.setItem('token', data.token);
      onLoginSuccess(data.user);
    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container login-page card">
      <h2 className="page-title">{isAdmin ? 'Administrator Login' : 'User Login'}</h2>
      {isAdmin ? (
        <div>
          <p>Login with your Petra wallet to access the administrator dashboard.</p>
          <button className="btn btn-primary" onClick={handleAdminLogin} disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Login with Petra'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleUserLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input id="username" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      )}
      <button className="btn btn-link" onClick={onShowRegister}>
        {isAdmin ? 'Register as Administrator' : 'Register as User'}
      </button>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
}