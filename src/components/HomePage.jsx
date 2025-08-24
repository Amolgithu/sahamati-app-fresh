import React, { useState, useEffect } from 'react';
import { AptosClient } from 'aptos';
import FeatureCard from './FeatureCard';

const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");

export default function HomePage({ onDaoCreated, onShowLogin, user }) {
  const [admins, setAdmins] = useState([]);
  const [trustScore, setTrustScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // FIX: default false
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [daoName, setDaoName] = useState("My Sahamati DAO");
  const [contributionAmount, setContributionAmount] = useState(10);

  useEffect(() => {
      if (!user) return;
      setIsLoading(true);
      const fetchData = async () => {
          try {
              const adminsRes = await fetch('http://localhost:3000/admins');
              const adminsData = await adminsRes.json();
              setAdmins(adminsData);
              if (adminsData.length > 0) {
                  setSelectedAdmin(adminsData[0].admin_id);
              }
              const scoreRes = await fetch(`http://localhost:3000/trust_score?user_id=${user.id}`);
              const scoreData = await scoreRes.json();
              setTrustScore(scoreData);
          } catch (error) {
              setStatusMessage(`Error: ${error.message}`);
          } finally {
              setIsLoading(false);
          }
      };
      fetchData();
  }, [user?.id]);

  const handleUpiSimulation = async (event) => {
      event.preventDefault();
      setStatusMessage('Simulating UPI payment...');
      try {
          let upiTxnId;
          if (window.crypto && window.crypto.randomUUID) {
              upiTxnId = `upi_test_${window.crypto.randomUUID()}`;
          } else {
              upiTxnId = `upi_test_${Math.random().toString(36).substring(2, 12)}`;
          }
          const response = await fetch('http://localhost:3000/payments/record', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  admin_id: selectedAdmin,
                  upi_txn_id: upiTxnId,
                  amount_inr: 100,
                  user_identifier: user.username,
              }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error);
          setStatusMessage(`Payment sent! On-chain Txn: ${result.txn_hash.substring(0, 12)}...`);
          const scoreRes = await fetch(`http://localhost:3000/trust_score?user_id=${user.id}`);
          setTrustScore(await scoreRes.json());
      } catch (error) {
          setStatusMessage(`Error: ${error.message}`);
      }
  };

  const handleAdminLogin = async () => {
    setIsLoading(true);
    setStatusMessage('Checking for your DAO...');
    if (!window.aptos) {
        setStatusMessage('Petra wallet not found!');
        setIsLoading(false);
        return;
    }
    await window.aptos.connect();
    const account = await window.aptos.account();
    try {
        const response = await fetch(`http://localhost:3000/dao_state?admin_address=${account.address}`);
        if (response.ok) {
            setStatusMessage("DAO found! Redirecting to your dashboard...");
            onDaoCreated(account.address);
        } else {
            setStatusMessage("No DAO found for this address. Please register by creating one.");
        }
    } catch (error) {
        setStatusMessage(`Error: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  const handleCreateDao = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setStatusMessage('Preparing to create your DAO...');
    if (!window.aptos) {
        setStatusMessage('Petra wallet not found!');
        setIsLoading(false);
        return;
    }
    try {
        await window.aptos.connect();
        const account = await window.aptos.account();
        const response = await fetch('http://localhost:3000/build_transaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                function_name: 'create_gat',
                args: [account.address, daoName, Number(contributionAmount)],
            }),
        });
        if (!response.ok) {
            const { error } = await response.json();
            if (error === "DAO already exists for this address.") {
                setStatusMessage("DAO already exists. Redirecting to your dashboard...");
                localStorage.setItem('adminAddress', account.address);
                onDaoCreated(account.address);
            } else {
                setStatusMessage(error || 'Failed to build transaction from server.');
            }
            setIsLoading(false);
            return;
        }
        const { payload } = await response.json();
        setStatusMessage('Please approve the transaction in your wallet...');
        const pendingTx = await window.aptos.signAndSubmitTransaction(payload);
        setStatusMessage('Waiting for transaction confirmation...');
        await client.waitForTransaction({ transactionHash: pendingTx.hash });
        setStatusMessage(`Registration complete! DAO created successfully. Txn: ${pendingTx.hash.substring(0,12)}...`);
        localStorage.setItem('adminAddress', account.address);
        onDaoCreated(account.address);
    } catch (error) {
        setStatusMessage(`Error: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  // Only show user dashboard if user is present
  if (user) {
    if (isLoading) return <p className="container">Loading User Dashboard...</p>;
    return (
      <div className="container">
          <h2 className="page-title">Welcome, {user.username}!</h2>
          <div className="dashboard-grid">
              <div className="dashboard-main">
                  <div className="card">
                      <h3>Simulate a Payment to a DAO</h3>
                      <form onSubmit={handleUpiSimulation}>
                          <div className="form-group">
                              <label htmlFor="admin-select">Select a DAO (Administrator)</label>
                              <select id="admin-select" value={selectedAdmin} onChange={e => setSelectedAdmin(e.target.value)}>
                                  {admins.map(admin => (
                                      <option key={admin.admin_id} value={admin.admin_id}>
                                          {admin.display_name} (Trust: {admin.trust_score})
                                      </option>
                                  ))}
                              </select>
                          </div>
                          <p>This will simulate a hardcoded UPI payment of 100 INR.</p>
                          <button type="submit" className="btn btn-primary">Simulate Payment</button>
                      </form>
                  </div>
              </div>
              <div className="dashboard-sidebar">
                  <div className="card">
                      <h3>Your Trust Score</h3>
                      {trustScore && (
                          <div>
                              <p className="treasury-amount">{trustScore.score}</p>
                              <h4>History:</h4>
                              <ul>
                                  {trustScore.history.slice(-5).map((entry, i) => <li key={i}>{entry}</li>)}
                              </ul>
                          </div>
                      )}
                  </div>
              </div>
          </div>
          {statusMessage && <p className="status-message">{statusMessage}</p>}
      </div>
    );
  }

  // Otherwise, show admin/user registration/login UI
  return (
    <div className="container home-page">
      <div className="admin-view card">
          <h2 className="hero-title">For <span className="hero-highlight">Administrators</span></h2>
          <p className="hero-subtitle">Register by creating a new DAO, or log in if you already have one.</p>
          <div className="admin-actions">
              <button onClick={handleAdminLogin} className="btn btn-secondary btn-launch" disabled={isLoading}>
                  Login with Petra
              </button>
          </div>
          <hr className="divider" />
          <form onSubmit={handleCreateDao} className="dao-form">
              <div className="form-group">
                  <label htmlFor="daoName">Your Group's Name (DAO Name)</label>
                  <input type="text" id="daoName" value={daoName} onChange={e => setDaoName(e.target.value)} />
              </div>
              <div className="form-group">
                  <label htmlFor="contributionAmount">Contribution Amount (in APT)</label>
                  <input type="number" id="contributionAmount" value={contributionAmount} min="0.00000001" step="0.1" onChange={e => setContributionAmount(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary btn-launch" disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Register & Create New DAO'}
              </button>
          </form>
      </div>
      <div className="user-view card">
          <h2 className="hero-title">For <span className="hero-highlight">Users</span></h2>
          <p className="hero-subtitle">Login or create an account to join a group and participate.</p>
          <button onClick={onShowLogin} className="btn btn-secondary btn-launch">Login or Register as User</button>
      </div>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
}
