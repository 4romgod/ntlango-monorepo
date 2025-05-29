'use server';

import { DeleteUserByIdDocument, getClient } from '@/data/graphql';
import { auth } from '@/auth';

export async function deleteUserProfileAction(prevState: any, formData: FormData) {
  const session = await auth();
  const userId = session?.user.userId;
  const token = session?.user.token;

  console.log('input data', userId);
  if (!userId || !token) {
    return {
      ...prevState,
      apiError: 'User is not authenticated',
      zodErrors: null,
    };
  }

  try {
    const deleteResponse = await getClient().mutate({
      mutation: DeleteUserByIdDocument,
      variables: {
        userId: userId,
      },
      context: {
        headers: {
          token: token,
        },
      },
    });

    // TODO after deleting, logout the user
    const responseData = deleteResponse.data?.deleteUserById;
    return {
      ...prevState,
      data: responseData,
      apiError: null,
      zodErrors: null,
    };
  } catch (error) {
    console.error('Failed when calling Delete User By Id Mutation', error);
    const networkError = (error as any).networkError;
    if (networkError) {
      console.error('Error Message', networkError.result.errors[0].message);
      return {
        ...prevState,
        apiError: networkError.result.errors[0].message,
        zodErrors: null,
      };
    }

    return {
      ...prevState,
      apiError: 'An error occurred while deleting your profile',
      zodErrors: null,
    };
  }
}
