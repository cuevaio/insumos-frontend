import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import './index.css';
import '@fontsource/roboto';

import { Toaster } from '@/components/ui/sonner';

import '@/lib/i18n/i18n';

import App from './App.tsx';
import { Providers } from './providers.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
      <Toaster />
    </Providers>
  </StrictMode>,
);
