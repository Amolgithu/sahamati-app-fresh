import React, { useState, useEffect } from 'react';
import { AptosClient } from 'aptos';

const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");

export default function DashboardPage({ adminAddress, adminUser }) {
    const [daoState, setDaoState] = useState(null);
    const [adminData, setAdminData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');
    const [newMemberAddress, setNewMemberAddress] = useState('');

    useEffect(() => {
        const fetchDaoState = async () => {
            try {
                setIsLoading(true);
                // Fetch the on-chain state of the DAO
                const response = await fetch(`http://localhost:3000/dao_state?admin_address=${adminAddress}`);
                if (!response.ok) {
                    const { error } = await response.json();
                    throw new Error(error);
                }
                const data = await response.json();
                setDaoState(data.data);

                // Fetch all admins to find this admin's trust score
                const adminsRes = await fetch('http://localhost:3000/admins');
                const adminsData = await adminsRes.json();
                const thisAdmin = adminsData.find(a => a.wallet_address === adminAddress);
                setAdminData(thisAdmin);

            } catch (error) {
                console.error("Failed to fetch DAO state:", error);
                setStatusMessage(`Error: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };
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
            // Refresh state after transaction
            const daoRes = await fetch(`http://localhost:3000/dao_state?admin_address=${adminAddress}`);
            const daoData = await daoRes.json();
            setDaoState(daoData.data);

            const adminsRes = await fetch('http://localhost:3000/admins');
            const adminsData = await adminsRes.json();
            const thisAdmin = adminsData.find(a => a.wallet_address === adminAddress);
            setAdminData(thisAdmin);

        } catch (error) {
            console.error("Transaction failed:", error);
            setStatusMessage(`Error: ${error.message}`);
        }
    };

    if (isLoading) return <p className="container">Loading DAO State...</p>;
    if (!daoState || !adminData) {
      return (
        <div className="container status-message">
          {statusMessage || "No DAO found for this address. Please register or check your wallet."}
        </div>
      );
    }

    return (
        <div className="container">
            <h2 className="page-title">{daoState.name}</h2>
            <p>DAO Trust Score: {adminData.trust_score}</p>
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
                            {daoState.members.map(m => (
                                <li key={m.addr}>
                                    <strong>Address:</strong> {m.addr.substring(0, 10)}...<br />
                                    <strong>Reputation:</strong> {m.reputation_score}
                                    {/* Optionally add more user info if available */}
                                </li>
                            ))}
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