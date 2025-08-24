import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UserDashboard from './components/UserDashboard';

export default function App() {
  const [view, setView] = useState('home');
  const [adminUser, setAdminUser] = useState(null); // Stores the full admin object
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [adminAddress, setAdminAddress] = useState(null);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  useEffect(() => {
    // Restore admin address from localStorage if present
    const savedAdminAddress = localStorage.getItem('adminAddress');
    if (savedAdminAddress) {
      setAdminAddress(savedAdminAddress);
    }
  }, []);

  const handleDaoCreated = (address) => {
    setAdminAddress(address);
  };

  const handleLoginSuccess = (userData) => {
    setLoggedInUser(userData);
  };

  const handleDisconnect = () => {
    setAdminUser(null);
    setLoggedInUser(null);
    localStorage.removeItem('token');
    setView('home');
  };

  const renderPage = () => {
    if (adminUser) {
      return <DashboardPage adminAddress={adminUser.wallet_address} adminUser={adminUser} />;
    }
    if (loggedInUser) {
      return <UserDashboard user={loggedInUser} />;
    }
    switch (view) {
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} onShowRegister={() => setView('register')} />;
      case 'register':
        return <RegisterPage onShowLogin={() => setView('login')} />;
      default:
        return <HomePage onDaoCreated={handleDaoCreated} onShowLogin={() => setView('login')} />;
    }
  };

  return (
    <div className="app-container">
      <Header
        walletConnected={!!adminUser || !!loggedInUser}
        userAddress={adminUser ? adminUser.wallet_address : (loggedInUser ? loggedInUser.username : '')}
        onDisconnectWallet={handleDisconnect}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <main className="main-content">
        {adminAddress ? (
          <DashboardPage adminAddress={adminAddress} />
        ) : (
          renderPage()
        )}
      </main>
    </div>
  );
}