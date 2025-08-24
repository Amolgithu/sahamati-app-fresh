import React, { useState } from 'react';

export default function RegisterPage({ onShowLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setStatusMessage('Registering...');

    try {
      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed.');
      
      setStatusMessage('Registration successful! Please log in.');
      // Automatically switch to the login form after a short delay
      setTimeout(onShowLogin, 1500);

    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container home-page">
      <form onSubmit={handleRegister} className="dao-form card">
        <h2 className="form-title">User Registration</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Register'}
        </button>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
        <p className="form-switch">
          Already have an account? <button type="button" onClick={onShowLogin} className="link-button">Login here</button>
        </p>
      </form>
    </div>
  );
}
