'use client';

import { Toaster } from '@/components/ui/sonner';
import React, { type ReactNode } from 'react';
import { QueryProvider } from './query-client';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps): React.ReactElement {
  return (
    <QueryProvider>
      {children}
      <Toaster richColors position="top-right" />
    </QueryProvider>
  );
}
