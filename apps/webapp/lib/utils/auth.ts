import { jwtVerify, decodeJwt } from 'jose';
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

export type DecodedToken = {
  userId?: string;
  email?: string;
  username?: string;
  iat?: number;
  exp?: number;
};

/**
 * Verify and decode a JWT token in one step.
 * Returns the decoded payload if valid, null otherwise.
 * This is the preferred method for extracting claims securely.
 */
export const verifyAndDecodeToken = async (token: string | undefined): Promise<DecodedToken | null> => {
  if (!token || !JWT_SECRET) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as DecodedToken;
  } catch {
    return null;
  }
};

/**
 * Decode a JWT token without verifying it.
 * WARNING: Only use for non-security-critical purposes (e.g., displaying user info).
 * For secure operations, use verifyAndDecodeToken instead.
 */
export const decodeToken = (token: string): DecodedToken | null => {
  if (!token) {
    return null;
  }

  try {
    const payload = decodeJwt(token);
    return payload as DecodedToken;
  } catch {
    return null;
  }
};
