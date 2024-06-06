import { getServerSideCookie } from '@/lib/utils';
import { ReactNode } from 'react';
import { verify } from 'jsonwebtoken';

export default function AccountLayout({ children }: { children: ReactNode }) {
  const token = getServerSideCookie('token')?.value;
  if (token) {
    try {
      const user = verify(token, 'secret');
      console.log('user', user);
    } catch (error) {
      console.log('error', error);
    }
  }

  return <>{children}</>;
}
