import React from 'react';
import FeatureCard from './FeatureCard';

const WalletIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/></svg>;

export default function HomePage({ onConnectWallet }) {
  return (
    <div className="container home-page">
      <h2 className="hero-title">
        Decentralized Trust, <span className="hero-highlight">Transparent Finance.</span>
      </h2>
      <p className="hero-subtitle">
        Sahamati leverages the Aptos blockchain to create a transparent, community-governed financial ecosystem. Build trust, access funds, and participate in a new era of finance.
      </p>
      <button onClick={onConnectWallet} className="btn btn-primary btn-launch">
        <WalletIcon /> Launch App & Connect Wallet
      </button>
      <div className="features-grid">
        <FeatureCard
          title="Blockchain Transparency"
          description="Every transaction is recorded on the Aptos blockchain, creating an immutable and publicly verifiable ledger to prevent fraud and build confidence."
        />
        <FeatureCard
          title="Dynamic Trust Score"
          description="Users build a quantifiable Trust Score based on their financial reliability. Higher scores unlock better opportunities within the ecosystem."
        />
        <FeatureCard
          title="Community-Based Lending"
          description="Access funds through a decentralized voting system. The community decides who gets funded based on trust and proposal viability."
        />
      </div>
    </div>
  );
}
