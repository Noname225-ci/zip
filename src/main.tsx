import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { CurrencyProvider } from './context/CurrencyContext';
import { SubscriptionProvider } from './context/SubscriptionContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <CurrencyProvider>
        <SubscriptionProvider>
          <App />
        </SubscriptionProvider>
      </CurrencyProvider>
    </HelmetProvider>
  </StrictMode>,
);
