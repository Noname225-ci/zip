import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  locale: string;
}

const CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: { code: 'USD', symbol: '$', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', locale: 'en-GB' },
  CAD: { code: 'CAD', symbol: 'C$', locale: 'en-CA' },
  AUD: { code: 'AUD', symbol: 'A$', locale: 'en-AU' },
  JPY: { code: 'JPY', symbol: '¥', locale: 'ja-JP' },
};

interface CurrencyContextType {
  currency: Currency;
  setCurrencyCode: (code: CurrencyCode) => void;
  formatCurrency: (amount: number) => string;
  availableCurrencies: typeof CURRENCIES;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencyCode, setCurrencyCodeState] = useState<CurrencyCode>('USD');

  useEffect(() => {
    const saved = localStorage.getItem('app_currency');
    if (saved && CURRENCIES[saved as CurrencyCode]) {
      setCurrencyCodeState(saved as CurrencyCode);
    }
  }, []);

  const setCurrencyCode = (code: CurrencyCode) => {
    setCurrencyCodeState(code);
    localStorage.setItem('app_currency', code);
  };

  const formatCurrency = (amount: number) => {
    if (!isFinite(amount)) return '∞';
    return new Intl.NumberFormat(CURRENCIES[currencyCode].locale, {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency: CURRENCIES[currencyCode], 
      setCurrencyCode, 
      formatCurrency,
      availableCurrencies: CURRENCIES
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
