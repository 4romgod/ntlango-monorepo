'use server';

import { auth } from '@/auth';
import { getClient } from '@/data/graphql';
import { DeleteEventByIdDocument } from '@/data/graphql/types/graphql';

export async function deleteEventAction(eventId: string) {
  const session = await auth();

  try {
    await getClient().mutate({
      mutation: DeleteEventByIdDocument,
      variables: { eventId },
      context: {
        headers: {
          token: session?.user.token,
        },
      },
    });

    return {
      message: `Event successfully deleted.`,
    };
  } catch (error) {
    console.error('Failed when calling Delete Event Mutation', error);
    return {
      apiError: 'Something went wrong.',
    };
  }
}
