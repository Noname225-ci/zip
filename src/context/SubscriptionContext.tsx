import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { secureStorage } from '../utils/secureStorage';
import { validateSubscriptionItem, CAPS } from '../utils/validation';

export interface SubscriptionItem {
  id: string;
  name: string;
  category: string;
  cost: number;
  frequency: 'monthly' | 'yearly';
  usage: number;
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

  // Load + validate from localStorage on mount
  useEffect(() => {
    const saved = secureStorage.getItem<unknown[]>(STORAGE_KEY);
    if (Array.isArray(saved)) {
      const validated = saved
        .map(validateSubscriptionItem)
        .filter((i): i is SubscriptionItem => i !== null)
        .slice(0, CAPS.DASHBOARD_ITEMS_MAX); // cap even if storage was hand-edited
      setItems(validated);
    }
  }, []);

  // Persist on every change
  useEffect(() => {
    secureStorage.setItem(STORAGE_KEY, items);
  }, [items]);

  const addItem = (item: SubscriptionItem) => {
    // Validate the incoming item before accepting it
    const safe = validateSubscriptionItem(item);
    if (!safe) return;
    setItems(prev => {
      if (prev.length >= CAPS.DASHBOARD_ITEMS_MAX) return prev; // hard cap
      if (prev.some(i => i.name === safe.name)) return prev;    // no dupes
      return [...prev, safe];
    });
  };

  const removeItem = (id: string) => {
    const safeId = String(id).slice(0, 40);
    setItems(prev => prev.filter(i => i.id !== safeId));
  };

  const importItems = (imported: unknown[]) => {
    if (!Array.isArray(imported)) return;
    const validated = imported
      .map(validateSubscriptionItem)
      .filter((i): i is SubscriptionItem => i !== null)
      .slice(0, CAPS.DASHBOARD_ITEMS_MAX);
    setItems(validated);
  };

  const clearAll = () => setItems([]);

  const totalMonthlyCost = items.reduce((acc, item) => {
    return acc + (item.frequency === 'yearly' ? item.cost / 12 : item.cost);
  }, 0);

  const totalYearlyCost = totalMonthlyCost * 12;
  const wastedCount = items.filter(i => i.verdict === 'wasted').length;

  return (
    <SubscriptionContext.Provider value={{
      items, addItem, removeItem, importItems, clearAll,
      totalMonthlyCost, totalYearlyCost, wastedCount
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) throw new Error('useSubscription must be used within a SubscriptionProvider');
  return context;
}
