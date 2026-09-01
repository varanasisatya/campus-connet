'use client';

import { useAuth } from '@/hooks/useAuth';

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  useAuth();
  return children;
}
