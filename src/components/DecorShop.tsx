export interface DecorItem {
  id: string;
  name: string;
  category: 'terminal' | 'hardware' | 'cooling' | 'ambient';
  costCredits: number;
}

export const DECOR_ITEMS: DecorItem[] = [
  { id: 'rack-unit-01', name: 'Auxiliary High-Density Server Rack', category: 'hardware', costCredits: 200 },
  { id: 'cool-pipe-01', name: 'Liquid Sub-zero Coolant Conduit', category: 'cooling', costCredits: 350 },
  { id: 'term-mon-01', name: 'Multi-screen Wall Monitor Hub', category: 'terminal', costCredits: 500 },
  { id: 'status-beacon-01', name: 'Monochrome Sub-level Status Beacon', category: 'ambient', costCredits: 150 },
];
