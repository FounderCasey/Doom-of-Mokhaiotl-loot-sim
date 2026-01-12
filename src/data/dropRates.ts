// Drop rates for Doom of Mokhaiotl unique items by delve level
// Format: 1/X chance (stored as X for easier calculation)

export interface DropRateEntry {
  cloth: number | null;
  eye: number | null;
  treads: number | null;
  pet: number | null;
}

export const DROP_RATES: Record<number, DropRateEntry> = {
  1: { cloth: null, eye: null, treads: null, pet: null },
  2: { cloth: 2500, eye: null, treads: null, pet: null },
  3: { cloth: 2000, eye: 2000, treads: null, pet: null },
  4: { cloth: 1350, eye: 1350, treads: 1350, pet: null },
  5: { cloth: 810, eye: 810, treads: 810, pet: null },
  6: { cloth: 765, eye: 765, treads: 765, pet: 1000 },
  7: { cloth: 720, eye: 720, treads: 720, pet: 750 },
  8: { cloth: 630, eye: 630, treads: 630, pet: 500 },
  9: { cloth: 540, eye: 540, treads: 540, pet: 250 },
};

// Guaranteed demon tears per delve level
export const DEMON_TEARS: Record<number, number> = {
  1: 0,
  2: 0,
  3: 50,
  4: 60,
  5: 70,
  6: 80,
  7: 90,
  8: 100,
  9: 100,
};

// Item information
export interface UniqueItem {
  id: string;
  name: string;
  unlocksAt: number;
  price: number;
  rarity: 'rare' | 'legendary' | 'pet';
}

export const UNIQUE_ITEMS: UniqueItem[] = [
  {
    id: 'cloth',
    name: 'Mokhaiotl Cloth',
    unlocksAt: 2,
    price: 45_000_000, // ~45M GP
    rarity: 'rare',
  },
  {
    id: 'eye',
    name: 'Eye of Ayak',
    unlocksAt: 3,
    price: 120_000_000, // ~120M GP
    rarity: 'legendary',
  },
  {
    id: 'treads',
    name: 'Avernic Treads',
    unlocksAt: 4,
    price: 85_000_000, // ~85M GP
    rarity: 'legendary',
  },
  {
    id: 'pet',
    name: 'Dom',
    unlocksAt: 6,
    price: 0, // Untradeable
    rarity: 'pet',
  },
];

// Demon tear price (approximate)
export const DEMON_TEAR_PRICE = 5000; // 5k GP each

// Calculate total tears for a full run to max delve
export function getTotalTearsForRun(maxDelve: number): number {
  let total = 0;
  for (let level = 1; level <= Math.min(maxDelve, 9); level++) {
    total += DEMON_TEARS[level];
  }
  return total;
}

// Get drop rate for an item at a specific delve level
export function getDropRate(itemId: string, delveLevel: number): number | null {
  const normalizedLevel = Math.min(delveLevel, 9);
  const rates = DROP_RATES[normalizedLevel];
  return rates[itemId as keyof DropRateEntry] ?? null;
}

// Get all available items at a delve level
export function getAvailableItems(delveLevel: number): UniqueItem[] {
  return UNIQUE_ITEMS.filter((item) => item.unlocksAt <= delveLevel);
}
