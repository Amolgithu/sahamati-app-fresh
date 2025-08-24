import React, { useState, useEffect } from 'react';

export default function UserDashboard({ user }) {
    const [admins, setAdmins] = useState([]);
    const [trustScore, setTrustScore] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');
    const [selectedAdmin, setSelectedAdmin] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch list of all admins/DAOs
                const adminsRes = await fetch('http://localhost:3000/admins');
                const adminsData = await adminsRes.json();
                setAdmins(adminsData);
                if (adminsData.length > 0) {
                    setSelectedAdmin(adminsData[0].admin_id);
                }

                // Fetch user's trust score
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
    }, [user.id]);

    const handleUpiSimulation = async (event) => {
        event.preventDefault();
        setStatusMessage('Simulating UPI payment...');
        try {
            const response = await fetch('http://localhost:3000/payments/record', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    admin_id: selectedAdmin,
                    upi_txn_id: `upi_test_${crypto.randomUUID()}`,
                    amount_inr: 100, // Hardcoded amount
                    user_identifier: user.username,
                }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);

            setStatusMessage(`Payment sent! On-chain Txn: ${result.txn_hash.substring(0, 12)}...`);
            // Refresh trust score after payment
            const scoreRes = await fetch(`http://localhost:3000/trust_score?user_id=${user.id}`);
            setTrustScore(await scoreRes.json());

        } catch (error) {
            setStatusMessage(`Error: ${error.message}`);
        }
    };

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
