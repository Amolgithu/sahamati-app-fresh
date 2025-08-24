import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';

export default function App() {
  // We now store the admin address, which is also the DAO's ID
  const [adminAddress, setAdminAddress] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  const handleDaoCreated = (address) => {
    setAdminAddress(address);
  };

  const handleDisconnect = () => {
    setAdminAddress(null);
  };

  return (
    <div className="app-container">
      <Header
        walletConnected={!!adminAddress}
        userAddress={adminAddress || ''}
        onDisconnectWallet={handleDisconnect}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <main className="main-content">
        {adminAddress ? (
          <DashboardPage adminAddress={adminAddress} />
        ) : (
          <HomePage onDaoCreated={handleDaoCreated} />
        )}
      </main>
    </div>
  );
}
