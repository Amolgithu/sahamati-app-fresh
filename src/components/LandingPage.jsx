import React from 'react';

export default function LandingPage({ onAdminLogin, onUserLogin }) {
  return (
    <div className="container landing-page">
      <div className="landing-content card">
        <h1 className="landing-title">Sahamati DAO Platform</h1>
        <p className="landing-info">
          Welcome to Sahamati! This platform enables decentralized savings and lending groups (DAOs) on Aptos.
          <br />
          Administrators can create and manage DAOs, while users can join, vote on proposals, and participate in group lending.
        </p>
        <div className="landing-actions">
          <button className="btn btn-primary" onClick={onAdminLogin}>
            Administrator Login
          </button>
          <button className="btn btn-secondary" onClick={onUserLogin}>
            User Login
          </button>
        </div>
      </div>
    </div>
  );
}