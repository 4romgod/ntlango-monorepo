import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';
import { getInstanceOfApolloClient } from '@/data/graphql/apollo-client';

/**
 * https://www.apollographql.com/blog/using-apollo-client-with-next-js-13-releasing-an-official-library-to-support-the-app-router
 */
export const { getClient } = registerApolloClient(() => {
  return getInstanceOfApolloClient();
});
