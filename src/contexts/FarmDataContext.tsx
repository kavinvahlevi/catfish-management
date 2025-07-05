
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo } from 'react';

// --- Data Structures ---
export interface Pond {
  id: string;
  name: string;
  area: number; // in m²
  fishCount: number;
  status: 'Aktif' | 'Tidak Aktif' | 'Perawatan';
}

export interface FeedingSchedule {
  time: string; // e.g., "08:00"
  feedAmount: number; // in kg
}

export interface GrowthRecord {
  id: string;
  date: Date;
  averageWeight: number; // in grams
  notes?: string;
}

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  type: 'Pemasukan' | 'Pengeluaran';
  amount: number;
}

export interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  description?: string;
}

export interface FarmData {
  ponds: Pond[];
  feedingSchedules: FeedingSchedule[];
  growthRecords: GrowthRecord[];
  transactions: Transaction[];
  calendarEvents: CalendarEvent[];
}

// --- Context Value Structure ---
export interface FarmDataContextValue extends FarmData {
  addPond: (pond: Omit<Pond, 'id'>) => void;
  updatePond: (pond: Pond) => void;
  deletePond: (pondId: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (transactionId: string) => void;
  addGrowthRecord: (record: Omit<GrowthRecord, 'id'>) => void;
  deleteGrowthRecord: (recordId: string) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteCalendarEvent: (eventId: string, date: Date) => void;
  updateFeedingSchedule: (schedules: FeedingSchedule[]) => void;
}

// --- Initial Data ---
const initialData: FarmData = {
  ponds: [
    { id: 'p1', name: 'Kolam A1', area: 100, fishCount: 1500, status: 'Aktif' },
    { id: 'p2', name: 'Kolam A2', area: 100, fishCount: 1500, status: 'Aktif' },
    { id: 'p3', name: 'Kolam B1', area: 120, fishCount: 1800, status: 'Aktif' },
    { id: 'p4', name: 'Kolam B2', area: 120, fishCount: 0, status: 'Perawatan' },
  ],
  feedingSchedules: [
    { time: '08:00', feedAmount: 10 },
    { time: '17:00', feedAmount: 12 },
  ],
  growthRecords: [
    { id: 'g1', date: new Date('2024-01-15'), averageWeight: 186, notes: 'Sampling awal' },
    { id: 'g2', date: new Date('2024-02-15'), averageWeight: 237, notes: 'Nafsu makan baik' },
    { id: 'g3', date: new Date('2024-03-15'), averageWeight: 273, notes: 'Pertumbuhan stabil' },
    { id: 'g4', date: new Date('2024-04-15'), averageWeight: 305, notes: 'Ukuran mulai seragam' },
    { id: 'g5', date: new Date('2024-05-15'), averageWeight: 359, notes: 'Siap panen sebagian' },
    { id: 'g6', date: new Date('2024-06-15'), averageWeight: 414, notes: 'Pasca panen parsial' },
  ],
  transactions: [
    { id: 't1', date: new Date('2024-06-01'), description: 'Pembelian pakan 5 sak', type: 'Pengeluaran', amount: 1500000 },
    { id: 't2', date: new Date('2024-06-05'), description: 'Pembelian probiotik', type: 'Pengeluaran', amount: 250000 },
    { id: 't3', date: new Date('2024-06-15'), description: 'Penjualan panen parsial Kolam C1', type: 'Pemasukan', amount: 7000000 },
    { id: 't4', date: new Date('2024-06-20'), description: 'Biaya listrik dan air', type: 'Pengeluaran', amount: 500000 },
  ],
  calendarEvents: [
    { id: 'e1', date: new Date(), title: 'Cek kualitas air' },
    { id: 'e2', date: new Date(new Date().setDate(new Date().getDate() + 5)), title: 'Jadwal Sampling Bobot' },
    { id: 'e3', date: new Date(new Date().setDate(new Date().getDate() + 10)), title: 'Perkiraan Panen Kolam A1' },
  ],
};

// --- Context ---
const FarmDataContext = createContext<FarmDataContextValue | undefined>(undefined);

// --- Provider ---
export function FarmDataProvider({ children }: { children: ReactNode }) {
  const [farmData, setFarmData] = useState<FarmData>(initialData);

  const contextValue = useMemo(() => {
    const addPond = (pond: Omit<Pond, 'id'>) => {
      const newPond = { ...pond, id: `p${Date.now()}` };
      setFarmData(prev => ({ ...prev, ponds: [...prev.ponds, newPond] }));
    };

    const updatePond = (updatedPond: Pond) => {
      setFarmData(prev => ({
        ...prev,
        ponds: prev.ponds.map(p => p.id === updatedPond.id ? updatedPond : p)
      }));
    }

    const deletePond = (pondId: string) => {
      setFarmData(prev => ({ ...prev, ponds: prev.ponds.filter(p => p.id !== pondId) }));
    };
    
    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
      const newTransaction = { ...transaction, id: `t${Date.now()}` };
      setFarmData(prev => ({ ...prev, transactions: [...prev.transactions, newTransaction].sort((a,b) => b.date.getTime() - a.date.getTime()) }));
    };

    const deleteTransaction = (transactionId: string) => {
      setFarmData(prev => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== transactionId) }));
    };

    const addGrowthRecord = (record: Omit<GrowthRecord, 'id'>) => {
      const newRecord = { ...record, id: `g${Date.now()}` };
      setFarmData(prev => ({ ...prev, growthRecords: [...prev.growthRecords, newRecord].sort((a,b) => a.date.getTime() - b.date.getTime()) }));
    };

    const deleteGrowthRecord = (recordId: string) => {
      setFarmData(prev => ({ ...prev, growthRecords: prev.growthRecords.filter(g => g.id !== recordId) }));
    }

    const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
      const newEvent = { ...event, id: `e${Date.now()}` };
      setFarmData(prev => ({...prev, calendarEvents: [...prev.calendarEvents, newEvent]}));
    }

    const deleteCalendarEvent = (eventId: string) => {
      setFarmData(prev => ({...prev, calendarEvents: prev.calendarEvents.filter(e => e.id !== eventId)}));
    }

    const updateFeedingSchedule = (schedules: FeedingSchedule[]) => {
      setFarmData(prev => ({...prev, feedingSchedules: schedules}));
    }

    return {
      ...farmData,
      addPond,
      updatePond,
      deletePond,
      addTransaction,
      deleteTransaction,
      addGrowthRecord,
      deleteGrowthRecord,
      addCalendarEvent,
      deleteCalendarEvent,
      updateFeedingSchedule
    };
  }, [farmData]);

  return (
    <FarmDataContext.Provider value={contextValue}>
      {children}
    </FarmDataContext.Provider>
  );
}

// --- Hook ---
export function useFarmData() {
  const context = useContext(FarmDataContext);
  if (context === undefined) {
    throw new Error('useFarmData must be used within a FarmDataProvider');
  }
  return context;
}
