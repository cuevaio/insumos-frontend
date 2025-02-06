import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppProvider } from './contexts/AppContext';

const queryClient = new QueryClient();
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>{children}</AppProvider>
    </QueryClientProvider>
  );
};
