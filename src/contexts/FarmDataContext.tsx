
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  writeBatch,
  query,
  getDocs,
  orderBy
} from 'firebase/firestore';


// --- Data Structures ---
export interface Pond {
  id: string;
  name: string;
  area: number; // in m²
  fishCount: number;
  status: 'Aktif' | 'Tidak Aktif' | 'Perawatan';
}

export interface FeedingSchedule {
  id: string;
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
  id:string;
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
  addPond: (pond: Omit<Pond, 'id'>) => Promise<void>;
  updatePond: (pond: Pond) => Promise<void>;
  deletePond: (pondId: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'> & { date: Date }) => Promise<void>;
  deleteTransaction: (transactionId: string) => Promise<void>;
  addGrowthRecord: (record: Omit<GrowthRecord, 'id' | 'date'> & { date: Date }) => Promise<void>;
  deleteGrowthRecord: (recordId: string) => Promise<void>;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id' | 'date'> & { date: Date }) => Promise<void>;
  deleteCalendarEvent: (eventId: string) => Promise<void>;
  updateFeedingSchedule: (schedules: Omit<FeedingSchedule, 'id'>[]) => Promise<void>;
  loading: boolean;
}

// --- Initial Data for Seeding ---
const initialData: Omit<FarmData, 'ponds'|'feedingSchedules'|'growthRecords'|'transactions'|'calendarEvents'> & {
  ponds: Omit<Pond, 'id'>[],
  feedingSchedules: Omit<FeedingSchedule, 'id'>[],
  growthRecords: Omit<GrowthRecord, 'id'>[],
  transactions: Omit<Transaction, 'id'>[],
  calendarEvents: Omit<CalendarEvent, 'id'>[],
} = {
  ponds: [
    { name: 'Kolam A1', area: 100, fishCount: 1500, status: 'Aktif' },
    { name: 'Kolam A2', area: 100, fishCount: 1500, status: 'Aktif' },
    { name: 'Kolam B1', area: 120, fishCount: 1800, status: 'Aktif' },
    { name: 'Kolam B2', area: 120, fishCount: 0, status: 'Perawatan' },
  ],
  feedingSchedules: [
    { time: '08:00', feedAmount: 10 },
    { time: '17:00', feedAmount: 12 },
  ],
  growthRecords: [
    { date: new Date('2024-01-15'), averageWeight: 186, notes: 'Sampling awal' },
    { date: new Date('2024-02-15'), averageWeight: 237, notes: 'Nafsu makan baik' },
    { date: new Date('2024-03-15'), averageWeight: 273, notes: 'Pertumbuhan stabil' },
    { date: new Date('2024-04-15'), averageWeight: 305, notes: 'Ukuran mulai seragam' },
    { date: new Date('2024-05-15'), averageWeight: 359, notes: 'Siap panen sebagian' },
    { date: new Date('2024-06-15'), averageWeight: 414, notes: 'Pasca panen parsial' },
  ],
  transactions: [
    { date: new Date('2024-06-01'), description: 'Pembelian pakan 5 sak', type: 'Pengeluaran', amount: 1500000 },
    { date: new Date('2024-06-05'), description: 'Pembelian probiotik', type: 'Pengeluaran', amount: 250000 },
    { date: new Date('2024-06-15'), description: 'Penjualan panen parsial Kolam C1', type: 'Pemasukan', amount: 7000000 },
    { date: new Date('2024-06-20'), description: 'Biaya listrik dan air', type: 'Pengeluaran', amount: 500000 },
  ],
  calendarEvents: [
    { date: new Date(), title: 'Cek kualitas air' },
    { date: new Date(new Date().setDate(new Date().getDate() + 5)), title: 'Jadwal Sampling Bobot' },
    { date: new Date(new Date().setDate(new Date().getDate() + 10)), title: 'Perkiraan Panen Kolam A1' },
  ],
};


// --- Helper function to seed data ---
async function seedInitialData() {
  const metaRef = doc(db, 'metadata', 'initialSeed');
  const metaSnap = await getDocs(query(collection(db, 'metadata')));
  
  if (metaSnap.empty) {
    console.log("Database kosong, melakukan seeding data awal...");
    const batch = writeBatch(db);
    
    initialData.ponds.forEach(item => batch.set(doc(collection(db, 'ponds')), item));
    initialData.feedingSchedules.forEach(item => batch.set(doc(collection(db, 'feedingSchedules')), item));
    initialData.growthRecords.forEach(item => batch.set(doc(collection(db, 'growthRecords')), { ...item, date: item.date.toISOString() }));
    initialData.transactions.forEach(item => batch.set(doc(collection(db, 'transactions')), { ...item, date: item.date.toISOString() }));
    initialData.calendarEvents.forEach(item => batch.set(doc(collection(db, 'calendarEvents')), { ...item, date: item.date.toISOString() }));
    
    batch.set(metaRef, { seeded: true, seededAt: new Date().toISOString() });
    
    await batch.commit();
    console.log("Seeding data selesai.");
  }
}


// --- Context ---
const FarmDataContext = createContext<FarmDataContextValue | undefined>(undefined);

// --- Provider ---
export function FarmDataProvider({ children }: { children: ReactNode }) {
  const [ponds, setPonds] = useState<Pond[]>([]);
  const [feedingSchedules, setFeedingSchedules] = useState<FeedingSchedule[]>([]);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const setupListeners = async () => {
      setLoading(true);
      try {
        await seedInitialData();
      } catch (error) {
        console.error("Gagal melakukan seeding data, mungkin karena konfigurasi Firebase belum diisi.", error);
        // Tetap lanjutkan meskipun gagal seeding, agar aplikasi tidak crash
      }

      const createListener = (collectionName: string, setter: Function, dateFields: string[] = [], sortField?: string) => {
        let q = query(collection(db, collectionName));
        if (sortField) {
            q = query(collection(db, collectionName), orderBy(sortField, 'asc'));
        }
        
        return onSnapshot(q, (snapshot) => {
          const items = snapshot.docs.map(doc => {
            const data = doc.data();
            dateFields.forEach(field => {
              if (data[field] && typeof data[field] === 'string') {
                data[field] = new Date(data[field]);
              }
            });
            return { id: doc.id, ...data };
          });
          setter(items);
        }, (error) => {
          console.error(`Error listening to ${collectionName}:`, error);
          if (error.code === 'failed-precondition' || error.code === 'unimplemented') {
            console.warn("Pastikan Anda sudah membuat index di Firestore jika diperlukan (lihat pesan error untuk detail).");
          } else if (error.code === 'permission-denied') {
            console.error("Akses ditolak. Periksa Firestore Security Rules Anda.");
          }
        });
      };

      const unsubPonds = createListener('ponds', setPonds, [], 'name');
      const unsubSchedules = createListener('feedingSchedules', setFeedingSchedules, [], 'time');
      const unsubGrowth = createListener('growthRecords', setGrowthRecords, ['date'], 'date');
      const unsubTransactions = createListener('transactions', setTransactions, ['date'], 'date');
      const unsubEvents = createListener('calendarEvents', setCalendarEvents, ['date']);

      setLoading(false);
      
      // Cleanup function
      return () => {
        unsubPonds();
        unsubSchedules();
        unsubGrowth();
        unsubTransactions();
        unsubEvents();
      };
    };

    const unsubscribePromise = setupListeners();

    return () => {
      unsubscribePromise.then(unsub => unsub && unsub());
    };
  }, []);

  const contextValue = useMemo<FarmDataContextValue>(() => ({
    ponds,
    feedingSchedules,
    growthRecords,
    transactions,
    calendarEvents,
    loading,

    addPond: async (pond) => {
      await addDoc(collection(db, 'ponds'), pond);
    },
    updatePond: async (pond) => {
      const { id, ...data } = pond;
      await updateDoc(doc(db, 'ponds', id), data);
    },
    deletePond: async (pondId) => {
      await deleteDoc(doc(db, 'ponds', pondId));
    },

    addTransaction: async (transaction) => {
        await addDoc(collection(db, 'transactions'), {
          ...transaction,
          date: transaction.date.toISOString(),
        });
    },
    deleteTransaction: async (transactionId) => {
      await deleteDoc(doc(db, 'transactions', transactionId));
    },

    addGrowthRecord: async (record) => {
      await addDoc(collection(db, 'growthRecords'), {
        ...record,
        date: record.date.toISOString(),
      });
    },
    deleteGrowthRecord: async (recordId) => {
      await deleteDoc(doc(db, 'growthRecords', recordId));
    },

    addCalendarEvent: async (event) => {
      await addDoc(collection(db, 'calendarEvents'), {
        ...event,
        date: event.date.toISOString(),
      });
    },
    deleteCalendarEvent: async (eventId) => {
      await deleteDoc(doc(db, 'calendarEvents', eventId));
    },
    
    updateFeedingSchedule: async (schedules) => {
        const batch = writeBatch(db);
        const currentSchedulesQuery = await getDocs(query(collection(db, 'feedingSchedules')));
        
        // Delete all old schedules
        currentSchedulesQuery.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        // Add new schedules
        schedules.forEach(schedule => {
            const newDocRef = doc(collection(db, 'feedingSchedules'));
            batch.set(newDocRef, schedule);
        });

        await batch.commit();
    }
  }), [ponds, feedingSchedules, growthRecords, transactions, calendarEvents, loading]);

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
