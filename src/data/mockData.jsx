export const MOCK_TRANSACTIONS = [
  { id: '0x1a2b...', date: '2025-08-23', amount: '500 Rs', type: 'in', status: 'Success' },
  { id: '0x3c4d...', date: '2025-08-22', amount: '150 Rs', type: 'out', status: 'Success' },
  { id: '0x5e6f...', date: '2025-08-21', amount: '25 Rs', type: 'out', status: 'Pending' },
  { id: '0x7g8h...', date: '2025-08-20', amount: '1200 Rs', type: 'in', status: 'Success' },
  { id: '0x9i0j...', date: '2025-08-19', amount: '75 Rs', type: 'out', status: 'Failed' },
];

export const MOCK_PROPOSALS = [
  { id: 1, requester: '0xUserA...f3e1', amount: '1000 Rs', reason: 'To fund a community art project.', yesVotes: 72, noVotes: 15, endsIn: '2d 4h' },
  { id: 2, requester: '0xUserB...c4a2', amount: '5000 Rs', reason: 'Seed funding for a new decentralized protocol.', yesVotes: 45, noVotes: 30, endsIn: '5d 1h' },
  { id: 3, requester: '0xUserC...b5d3', amount: '250 Rs', reason: 'Emergency medical expenses.', yesVotes: 98, noVotes: 2, endsIn: '12h 30m' },
];
