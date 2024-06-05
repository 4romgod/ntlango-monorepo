import { UserWithTokenType } from '@/data/graphql/types/graphql';
import { cookies } from 'next/headers';

const ONE_DAY = 24 * 60 * 60 * 1000;

export const setServerSideCookie = (key: string, value: string) => {
  cookies().set(key, value, { maxAge: ONE_DAY });
};

export const removeServerSideCookie = (key: string) => {
  cookies().delete(key);
};

export const getServerSideCookie = (key: string) => {
  return cookies().get(key);
};

export const authenticateServerSide = (data: UserWithTokenType) => {
  const { token } = data;
  setServerSideCookie('token', token);
};

export const signout = () => {
  removeServerSideCookie('token');
};
