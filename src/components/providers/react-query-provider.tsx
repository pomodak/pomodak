import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactNode } from 'react';

import { useApiError } from '@/hooks/use-api-error';

const MINUTE = 1000 * 60;

export const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  const { handleError } = useApiError();
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        onError: handleError,
      },

      queries: {
        gcTime: 10 * MINUTE,
        retry: 1,
      },
    },
    queryCache: new QueryCache({
      onError: handleError,
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
