import React from 'react';
import { MOCK_TRANSACTIONS } from '../data/mockData';

export default function DashboardPage({ onShowProposalModal }) {
    const trustScore = 85;
    return (
        <div className="container">
            <h2 className="page-title">Admin Dashboard</h2>
            <div className="dashboard-grid">
                <div className="dashboard-main">
                    <div className="card">
                        <h3>Recent Transactions</h3>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Transaction ID</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MOCK_TRANSACTIONS.map((tx) => (
                                        <tr key={tx.id}>
                                            <td className="tx-id">{tx.id}</td>
                                            <td>{tx.date}</td>
                                            <td className={tx.type === 'in' ? 'amount-in' : 'amount-out'}>
                                                {tx.type === 'in' ? '+' : '-'} {tx.amount}
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${tx.status.toLowerCase()}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="dashboard-sidebar">
                    <div className="card">
                        <h3>Your Trust Score</h3>
                        <div className="trust-score-visual">
                            <svg viewBox="0 0 36 36">
                                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                                <path className="circle" strokeDasharray={`${trustScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                            </svg>
                            <span>{trustScore}</span>
                        </div>
                        <p className="trust-score-standing">Excellent Standing</p>
                    </div>
                    <div className="card">
                        <h3>Quick Actions</h3>
                        <button onClick={onShowProposalModal} className="btn btn-primary full-width">
                            Create Loan Proposal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
