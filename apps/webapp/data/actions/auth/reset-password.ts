'use server';

import { ResetPasswordInputTypeSchema } from '@/data/validation';

export async function resetPasswordAction(prevState: any, formData: FormData) {
  const password = formData.get('password')?.toString() ?? '';
  const confirmPassword = formData.get('confirm-password')?.toString() ?? '';

  const inputData = {
    password: password,
    'confirm-password': confirmPassword,
  };

  const validatedFields = ResetPasswordInputTypeSchema.safeParse(inputData);
  if (!validatedFields.success) {
    return {
      ...prevState,
      apiError: null,
      zodErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // TODO Call the API
}
