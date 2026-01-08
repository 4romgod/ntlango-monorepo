import { jwtVerify } from 'jose';
import { JWT_SECRET } from '@/lib/constants/environment-variables';

export const isAuthenticated = async (token: string | undefined): Promise<boolean> => {
  if (!token || !JWT_SECRET) {
    return false;
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
};
