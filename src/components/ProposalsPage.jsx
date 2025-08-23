import React from 'react';
import { MOCK_PROPOSALS } from '../data/mockData';
import ProposalCard from './ProposalCard';

export default function ProposalsPage({ onShowProposalModal }) {
  return (
    <div className="container">
      <div className="page-header">
        <h2 className="page-title">Active Proposals</h2>
        <button onClick={onShowProposalModal} className="btn btn-primary">
          Create New Proposal
        </button>
      </div>
      <div className="proposals-grid">
        {MOCK_PROPOSALS.map(p => <ProposalCard key={p.id} proposal={p} />)}
      </div>
    </div>
  );
}