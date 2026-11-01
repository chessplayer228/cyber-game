export interface PvpOpponent {
  id: string;
  username: string;
  equippedTitle: string;
  reputationPoints: number;
  defenseRating: number;
  vaultBalances: {
    energy: number;
    data: number;
    crypto: number;
    credits: number;
  };
}

export const MOCK_RIVALS: PvpOpponent[] = [
  {
    id: 'rival-01',
    username: 'GhostProtocol',
    equippedTitle: 'Cipher Analyst',
    reputationPoints: 1240,
    defenseRating: 85,
    vaultBalances: { energy: 350, data: 420, crypto: 150, credits: 890 },
  },
  {
    id: 'rival-02',
    username: 'HexaDaemon',
    equippedTitle: 'Grid Phantom',
    reputationPoints: 1890,
    defenseRating: 140,
    vaultBalances: { energy: 600, data: 780, crypto: 340, credits: 1650 },
  },
  {
    id: 'rival-03',
    username: 'NullPointer',
    equippedTitle: 'System Architect',
    reputationPoints: 2450,
    defenseRating: 210,
    vaultBalances: { energy: 950, data: 1200, crypto: 520, credits: 2800 },
  },
  {
    id: 'rival-04',
    username: 'VectorPrime',
    equippedTitle: 'Subnet Broker',
    reputationPoints: 950,
    defenseRating: 60,
    vaultBalances: { energy: 220, data: 310, crypto: 95, credits: 540 },
  },
];
