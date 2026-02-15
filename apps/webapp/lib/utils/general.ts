import { UserWithToken, User } from '@/data/graphql/types/graphql';

type UserLike =
  | Pick<UserWithToken, 'given_name' | 'family_name' | 'profile_picture'>
  | Pick<User, 'given_name' | 'family_name' | 'profile_picture'>;

/**
 * Type guard to check if a value is a non-null object record
 */
export const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export const getAvatarSrc = (user: UserLike | null | undefined) => {
  if (!user) return undefined;
  return user.profile_picture ?? undefined;
};

export const getDisplayName = (user: UserLike | null | undefined) => {
  if (!user) return 'Account';
  return [user.given_name, user.family_name].filter(Boolean).join(' ');
};

export const getFileExtension = (file: File) => {
  return file.name.split('.').pop()?.toLowerCase() || '';
};
