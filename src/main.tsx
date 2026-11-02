import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Signal Telegram WebApp readiness & expand viewport
try {
  const tg = (window as any).Telegram?.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
  }
} catch (e) {
  console.warn('Telegram WebApp init warning:', e);
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
