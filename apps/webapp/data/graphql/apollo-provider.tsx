'use client';

import { GRAPHQL_URL } from '@/lib/constants';
import { HttpLink } from '@apollo/client';
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
} from '@apollo/experimental-nextjs-app-support/ssr';

const makeClient = () => {
  const httpLink = new HttpLink({
    uri: GRAPHQL_URL,
    fetchOptions: { next: { revalidate: 0 } },
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: httpLink,
  });
};

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
