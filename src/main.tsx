import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CurrencyProvider } from './context/CurrencyContext';
import { SubscriptionProvider } from './context/SubscriptionContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CurrencyProvider>
      <SubscriptionProvider>
        <App />
      </SubscriptionProvider>
    </CurrencyProvider>
  </StrictMode>,
);
