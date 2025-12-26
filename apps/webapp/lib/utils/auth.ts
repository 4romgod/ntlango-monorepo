import { verify, JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@/lib/constants/environment-variables';

export const isAuthenticated = (token: string | undefined) => {
  if (!token || !JWT_SECRET) {
    return false;
  }

  try {
    const decodedToken = verify(token, JWT_SECRET) as JwtPayload;
    const expiresAt = decodedToken?.exp ? decodedToken.exp * 1000 : null;
    const isTokenExpired = expiresAt ? Date.now() > expiresAt : false;
    return !isTokenExpired;
  } catch {
    return false;
  }
};
