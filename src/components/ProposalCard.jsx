import React from 'react';

const CheckCircleIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;
const XCircleIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>;

export default function ProposalCard({ proposal }) {
  const totalVotes = proposal.yesVotes + proposal.noVotes;
  const yesPercentage = totalVotes > 0 ? (proposal.yesVotes / totalVotes) * 100 : 0;

  return (
    <div className="card proposal-card">
        <div className="proposal-header">
            <div>
                <p className="proposal-requester">Requester: {proposal.requester.substring(0, 8)}...{proposal.requester.substring(proposal.requester.length - 4)}</p>
                <p className="proposal-amount">{proposal.amount}</p>
            </div>
            <span className="proposal-ends-in">{proposal.endsIn}</span>
        </div>
        <p className="proposal-reason">{proposal.reason}</p>
        <div className="proposal-voting">
            <div className="vote-bar-info">
                <span>Votes ({totalVotes})</span>
                <span>{yesPercentage.toFixed(0)}% Yes</span>
            </div>
            <div className="vote-bar-container">
                <div className="vote-bar-yes" style={{ width: `${yesPercentage}%` }}></div>
            </div>
            <div className="vote-buttons">
                <button className="btn btn-vote-yes"><CheckCircleIcon /> Vote Yes</button>
                <button className="btn btn-vote-no"><XCircleIcon /> Vote No</button>
            </div>
        </div>
    </div>
  );
}