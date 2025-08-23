import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';
import ProposalsPage from './components/ProposalsPage';
import ProposalModal from './components/ProposalModal';

export default function App() {
  const [page, setPage] = useState('home');
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showProposalModal, setShowProposalModal] = useState(false);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  const handleConnectWallet = () => {
    setWalletConnected(true);
    setUserAddress('0xAdmin...a1b2');
    setPage('dashboard');
  };

  const handleDisconnectWallet = () => {
    setWalletConnected(false);
    setUserAddress('');
    setPage('home');
  };

  const renderPage = () => {
    if (!walletConnected) {
      return <HomePage onConnectWallet={handleConnectWallet} />;
    }
    switch (page) {
      case 'dashboard':
        return <DashboardPage onShowProposalModal={() => setShowProposalModal(true)} />;
      case 'proposals':
        return <ProposalsPage onShowProposalModal={() => setShowProposalModal(true)} />;
      default:
        return <HomePage onConnectWallet={handleConnectWallet} />;
    }
  };

  return (
    <div className="app-container">
      <Header
        walletConnected={walletConnected}
        userAddress={userAddress}
        onDisconnectWallet={handleDisconnectWallet}
        setPage={setPage}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <main className="main-content">
        {renderPage()}
      </main>
      {showProposalModal && <ProposalModal onClose={() => setShowProposalModal(false)} />}
    </div>
  );
}