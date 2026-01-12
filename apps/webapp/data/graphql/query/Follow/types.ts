import { GetFollowingQuery, GetFollowersQuery } from '@/data/graphql/types/graphql';

export type Following = NonNullable<GetFollowingQuery['readFollowing']>[number];
export type Follower = NonNullable<GetFollowersQuery['readFollowers']>[number];
