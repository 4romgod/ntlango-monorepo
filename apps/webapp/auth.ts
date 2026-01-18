import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { isAuthenticated, logger } from '@/lib/utils';

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = { ...user };
        return token;
      }

      const tokenString = token?.token as string | undefined;
      if (tokenString) {
        // Log token for debugging (first 50 chars only for security)
        logger.debug('[Auth] Validating token:', tokenString.substring(0, 50) + '...');
        const isValid = await isAuthenticated(tokenString);
        logger.debug('[Auth] Token valid:', isValid);
        if (!isValid) {
          logger.warn('[Auth] Token validation failed - token expired or invalid');

          // This signals to NextAuth that the session should be terminated
          return null as unknown as typeof token;
        }
      }

      return token;
    },
    async session({ token, session }) {
      // If token is null/empty, the session is invalid - return empty session
      if (!token || Object.keys(token).length === 0) {
        logger.warn('[Auth] Session invalidated - no valid token');
        // Return session with user set to undefined to trigger re-auth
        // NextAuth will treat this as unauthenticated
        session.user = undefined as unknown as typeof session.user;
        return session;
      }

      session.user = { ...token, ...session.user };
      return session;
    },
  },
  session: { strategy: 'jwt' },
  ...authConfig,
});
