import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UserDashboard from './components/UserDashboard';
import LandingPage from './components/LandingPage';

export default function App() {
  const [view, setView] = useState('home');
  const [adminUser, setAdminUser] = useState(null);       // Stores the full admin object
  const [loggedInUser, setLoggedInUser] = useState(null); // Stores the full user object
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
    localStorage.setItem('adminAddress', address);
  };

  const handleUserLoginSuccess = (userData) => {
    setLoggedInUser(userData);
    setAdminUser(null);
    setAdminAddress(null);
    localStorage.removeItem('adminAddress');
    setView('home');
  };

  const handleAdminLoginSuccess = (adminData) => {
    setAdminUser(adminData);
    setAdminAddress(adminData.wallet_address);
    setLoggedInUser(null);
    localStorage.setItem('adminAddress', adminData.wallet_address);
    setView('home');
  };

  const handleDisconnect = () => {
    setAdminUser(null);
    setLoggedInUser(null);
    setAdminAddress(null);
    localStorage.removeItem('adminAddress');
    localStorage.removeItem('token');
    setView('home');
  };

  const renderPage = () => {
    if (adminUser || adminAddress) {
      return (
        <DashboardPage
          adminAddress={adminUser ? adminUser.wallet_address : adminAddress}
          adminUser={adminUser}
        />
      );
    }
    if (loggedInUser) {
      return <UserDashboard user={loggedInUser} />;
    }

    // Routing between other pages
    switch (view) {
      case 'login':
        return (
          <LoginPage
            onLoginSuccess={handleUserLoginSuccess}
            onShowRegister={() => setView('register')}
          />
        );
      case 'register':
        return (
          <RegisterPage
            onShowLogin={() => setView('login')}
          />
        );
      case 'admin':
        return (
          <LoginPage
            isAdmin
            onLoginSuccess={handleAdminLoginSuccess}
            onShowRegister={() => setView('register')}
          />
        );
      case 'home':
      default:
        return (
          <LandingPage
            onAdminLogin={() => setView('admin')}
            onUserLogin={() => setView('login')}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <Header
        walletConnected={!!adminUser || !!loggedInUser}
        userAddress={
          adminUser
            ? adminUser.wallet_address
            : (loggedInUser ? loggedInUser.username : '')
        }
        onDisconnectWallet={handleDisconnect}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}
