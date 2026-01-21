import { useSession } from 'next-auth/react';

export function useIsAuthenticated(): boolean {
  const { data: session, status } = useSession();
  return status === 'authenticated' && !!session?.user && !!session.user.userId;
}
