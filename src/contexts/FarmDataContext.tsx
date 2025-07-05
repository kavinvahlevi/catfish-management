'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

// Data Structures
interface PondData {
  activeCount: number;
  totalArea: number; // in m²
}

interface FeedData {
  schedule: string;
  nextFeeding: string;
}

interface FinanceData {
  monthlyProfit: number;
  profitCurrency: string;
}

interface GrowthDataPoint {
  month: string;
  weight: number; // in grams
}

interface FarmData {
  ponds: PondData;
  feed: FeedData;
  finance: FinanceData;
  growthData: GrowthDataPoint[];
}

// Initial Data
const initialFarmData: FarmData = {
  ponds: {
    activeCount: 12,
    totalArea: 1200,
  },
  feed: {
    schedule: '08:00 & 17:00',
    nextFeeding: 'Harian',
  },
  finance: {
    monthlyProfit: 5250000,
    profitCurrency: 'IDR',
  },
  growthData: [
    { month: 'Januari', weight: 186 },
    { month: 'Februari', weight: 305 },
    { month: 'Maret', weight: 237 },
    { month: 'April', weight: 273 },
    { month: 'Mei', weight: 309 },
    { month: 'Juni', weight: 414 },
  ],
};

// Context
const FarmDataContext = createContext<FarmData | undefined>(undefined);

// Provider
export function FarmDataProvider({ children }: { children: ReactNode }) {
  // In a real app, this data would likely come from an API or a more complex state management solution.
  const value = initialFarmData;

  return (
    <FarmDataContext.Provider value={value}>
      {children}
    </FarmDataContext.Provider>
  );
}

// Hook
export function useFarmData() {
  const context = useContext(FarmDataContext);
  if (context === undefined) {
    throw new Error('useFarmData must be used within a FarmDataProvider');
  }
  return context;
}
