import React, { useState } from 'react';
// Make sure to install the aptos sdk in your frontend project: npm install aptos
import { AptosClient } from 'aptos';

const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");

export default function HomePage({ onDaoCreated }) {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [daoName, setDaoName] = useState("My Sahamati DAO");
  const [contribution, setContribution] = useState(10); // in APT

  const handleCreateDao = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setStatusMessage('Starting Admin Registration...');

    if (!window.aptos) {
        setStatusMessage('Petra wallet not found! Please install the Petra extension to register.');
        window.open('https://petra.app/', '_blank', 'noopener,noreferrer');
        setIsLoading(false);
        return;
    }

    try {
        setStatusMessage('Please connect your Petra wallet to register...');
        await window.aptos.connect();
        const account = await window.aptos.account();
        setStatusMessage(`Wallet connected: ${account.address.substring(0, 8)}...`);

        // 1. Ask backend to build the transaction payload for creating the DAO
        const response = await fetch('http://localhost:3000/build_transaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                function_name: 'create_gat',
                args: [daoName, (contribution * 10**8).toString()], // Convert APT to Octas
            }),
        });

        if (!response.ok) throw new Error('Failed to build transaction from server.');
        const { payload } = await response.json();

        // 2. Ask user to sign and submit the transaction via Petra
        setStatusMessage('Please approve the transaction in your wallet to create your DAO and complete registration...');
        const pendingTx = await window.aptos.signAndSubmitTransaction(payload);
        
        // 3. Wait for the transaction to be confirmed on-chain
        setStatusMessage('Waiting for transaction confirmation...');
        await client.waitForTransaction({ transactionHash: pendingTx.hash });

        setStatusMessage(`Registration complete! DAO created successfully. Txn: ${pendingTx.hash.substring(0,12)}...`);
        onDaoCreated(account.address); // This logs the user in and moves to the dashboard

    } catch (error) {
        console.error('Registration/DAO creation failed:', error);
        setStatusMessage(`Error: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="container home-page">
      <h2 className="hero-title">Become a Sahamati <span className="hero-highlight">Administrator.</span></h2>
      <p className="hero-subtitle">Register by creating your own decentralized savings and lending group (DAO) on the Aptos blockchain. Your Petra wallet is your account.</p>
      
      <form onSubmit={handleCreateDao} className="dao-form card">
        <div className="form-group">
            <label htmlFor="daoName">Your Group's Name (DAO Name)</label>
            <input type="text" id="daoName" value={daoName} onChange={e => setDaoName(e.target.value)} />
        </div>
        <div className="form-group">
            <label htmlFor="contribution">Contribution Amount (APT per member)</label>
            <input type="number" id="contribution" value={contribution} onChange={e => setContribution(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary btn-launch" disabled={isLoading}>
            {isLoading ? 'Processing Registration...' : 'Register & Create Your DAO'}
        </button>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </form>
    </div>
  );
}
