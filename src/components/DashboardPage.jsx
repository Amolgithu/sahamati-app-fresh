import React, { useState, useEffect } from 'react';
// Make sure to install the aptos sdk in your frontend project: npm install aptos
import { AptosClient } from 'aptos';

const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");

export default function DashboardPage({ adminAddress }) {
    const [daoState, setDaoState] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');
    const [newMemberAddress, setNewMemberAddress] = useState('');

    const fetchDaoState = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:3000/dao_state?admin_address=${adminAddress}`);
            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error);
            }
            const data = await response.json();
            setDaoState(data.data); // The actual data is in the .data field
        } catch (error) {
            console.error("Failed to fetch DAO state:", error);
            setStatusMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDaoState();
    }, [adminAddress]);

    // Generic function to handle all contract interactions
    const handleContractInteraction = async (function_name, args = [], type_args = []) => {
        setStatusMessage('Preparing transaction...');
        try {
            const response = await fetch('http://localhost:3000/build_transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ function_name, args, type_args }),
            });
            if (!response.ok) throw new Error('Failed to build transaction.');
            const { payload } = await response.json();

            const pendingTx = await window.aptos.signAndSubmitTransaction(payload);
            await client.waitForTransaction({ transactionHash: pendingTx.hash });
            setStatusMessage(`Success! Txn: ${pendingTx.hash.substring(0,12)}...`);
            fetchDaoState(); // Refresh state after transaction
        } catch (error) {
            console.error("Transaction failed:", error);
            setStatusMessage(`Error: ${error.message}`);
        }
    };

    if (isLoading) return <p className="container">Loading DAO State...</p>;
    if (!daoState) return <p className="container status-message">{statusMessage}</p>;

    return (
        <div className="container">
            <h2 className="page-title">{daoState.name}</h2>
            <div className="dashboard-grid">
                <div className="dashboard-main">
                    {/* DAO Stats */}
                    <div className="card">
                        <h3>DAO Treasury</h3>
                        <p className="treasury-amount">{(parseInt(daoState.total_pot.value) / 10**8).toFixed(4)} APT</p>
                        <p>Contribution Amount: {parseInt(daoState.contribution_amount) / 10**8} APT</p>
                        <button onClick={() => handleContractInteraction('deposit_funds', [adminAddress])}>Deposit My Contribution</button>
                    </div>

                    {/* Member Management */}
                    <div className="card">
                        <h3>Members ({daoState.members.length})</h3>
                        <ul>
                            {daoState.members.map(m => <li key={m.addr}>{m.addr.substring(0,10)}... (Rep: {m.reputation_score})</li>)}
                        </ul>
                        <form onSubmit={(e) => { e.preventDefault(); handleContractInteraction('add_member', [newMemberAddress]); }}>
                            <input type="text" value={newMemberAddress} onChange={e => setNewMemberAddress(e.target.value)} placeholder="New member address" />
                            <button type="submit">Add Member</button>
                        </form>
                    </div>
                </div>

                <div className="dashboard-sidebar">
                     {/* Voting Section */}
                    <div className="card">
                        <h3>Payout Voting</h3>
                        {daoState.current_proposal_recipient.vec.length > 0 ? (
                            <div>
                                <p>Proposal for: {daoState.current_proposal_recipient.vec[0].substring(0,10)}...</p>
                                <p>Votes: {daoState.votes.length} / {daoState.members.length}</p>
                                <button onClick={() => handleContractInteraction('vote_on_proposal', [adminAddress])}>Vote Yes</button>
                                <button onClick={() => handleContractInteraction('release_pot_after_vote', [adminAddress])}>Execute Payout</button>
                            </div>
                        ) : (
                            <p>No active proposal.</p>
                        )}
                    </div>
                </div>
            </div>
            {statusMessage && <p className="status-message">{statusMessage}</p>}
        </div>
    );
}