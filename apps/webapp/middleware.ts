import NextAuth from 'next-auth';
import authConfig from '@/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  console.log('ROUTE: ', req.nextUrl.pathname);
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'], // https://clerk.com/docs/references/nextjs/auth-middleware#usage
};
