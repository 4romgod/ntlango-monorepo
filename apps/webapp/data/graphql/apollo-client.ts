import { HttpLink, InMemoryCache, ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { GRAPHQL_URL } from '@/lib/constants';

let apolloClient: ApolloClient<NormalizedCacheObject>;

export const getInstanceOfApolloClient = (
  url = GRAPHQL_URL,
  newInstance?: boolean,
): ApolloClient<NormalizedCacheObject> => {
  if (!apolloClient || newInstance) {
    apolloClient = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: url,
        fetchOptions: { next: { revalidate: 0 } },
      }),
    });
  }
  return apolloClient;
};
