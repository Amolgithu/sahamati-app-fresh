import React from 'react';

export default function ProposalModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Create a New Loan Proposal</h2>
        <form>
          <div className="form-group">
            <label htmlFor="amount">Loan Amount (APT)</label>
            <input type="number" id="amount" placeholder="e.g., 500" />
          </div>
          <div className="form-group">
            <label htmlFor="reason">Reason</label>
            <textarea id="reason" rows="4" placeholder="Briefly describe the purpose of this loan..."></textarea>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Submit Proposal</button>
          </div>
        </form>
      </div>
    </div>
  );
}
