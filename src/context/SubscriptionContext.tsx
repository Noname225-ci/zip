import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { subscriptionsData, categoryThresholds, defaultThresholds } from '../data/subscriptions';
import { secureStorage } from '../utils/secureStorage';

export interface SubscriptionItem {
  id: string;
  name: string;
  category: string;
  cost: number;
  frequency: 'monthly' | 'yearly';
  usage: number; // uses per month
  verdict: 'good' | 'consider' | 'wasted';
}

interface SubscriptionContextType {
  items: SubscriptionItem[];
  addItem: (item: SubscriptionItem) => void;
  removeItem: (id: string) => void;
  importItems: (imported: SubscriptionItem[]) => void;
  clearAll: () => void;
  totalMonthlyCost: number;
  totalYearlyCost: number;
  wastedCount: number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const STORAGE_KEY = 'my_subscriptions_dashboard';

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SubscriptionItem[]>([]);

  // Load from local storage
  useEffect(() => {
    const saved = secureStorage.getItem<SubscriptionItem[]>(STORAGE_KEY);
    if (saved) {
      setItems(saved);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    secureStorage.setItem(STORAGE_KEY, items);
  }, [items]);

  const addItem = (item: SubscriptionItem) => {
    setItems(prev => [...prev, item]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const importItems = (imported: SubscriptionItem[]) => {
    setItems(imported);
  };

  const clearAll = () => {
    setItems([]);
  };

  const totalMonthlyCost = items.reduce((acc, item) => {
    return acc + (item.frequency === 'yearly' ? item.cost / 12 : item.cost);
  }, 0);

  const totalYearlyCost = totalMonthlyCost * 12;
  const wastedCount = items.filter(i => i.verdict === 'wasted').length;

  return (
    <SubscriptionContext.Provider value={{
      items,
      addItem,
      removeItem,
      importItems,
      clearAll,
      totalMonthlyCost,
      totalYearlyCost,
      wastedCount
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
