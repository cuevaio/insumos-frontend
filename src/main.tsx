import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import './index.css';

import { Toaster } from '@/components/ui/sonner';

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
