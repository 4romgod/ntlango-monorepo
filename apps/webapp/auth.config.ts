import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { LoginUserInputTypeSchema } from './data/validation';
import { loginUserGlobalAction } from './data/actions/global/auth/login';
import type { NextAuthConfig } from 'next-auth';

export default {
  providers: [
    GitHubProvider,
    GoogleProvider,
    CredentialsProvider({
      async authorize(credentials) {
        const validatedFields = LoginUserInputTypeSchema.safeParse(credentials);
        if (validatedFields.success) {
          const loginInput = validatedFields.data;
          const loginResponse = await loginUserGlobalAction(loginInput);
          return loginResponse;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
