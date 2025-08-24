import React from 'react';

const SunIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m4.93 17.66 1.41-1.41"/><path d="m17.66 4.93 1.41-1.41"/></svg>;
const MoonIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>;

export default function Header({ walletConnected, userAddress, onDisconnectWallet, setPage, isDarkMode, setIsDarkMode }) {
  return (
    <header className="app-header">
      <div className="container header-content">
        <div className="header-left">
          <div className="logo" onClick={() => setPage(walletConnected ? 'dashboard' : 'home')}>
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            <h1>Sahamati</h1>
          </div>
        </div>
        <div className="header-right">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="theme-toggle">
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>
          {walletConnected && (
            <>
              <span className="user-address">{userAddress.substring(0, 6)}...{userAddress.substring(userAddress.length - 4)}</span>
              <button onClick={onDisconnectWallet} className="btn btn-disconnect">
                Disconnect
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
