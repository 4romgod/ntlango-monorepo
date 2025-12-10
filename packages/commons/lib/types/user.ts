import z from 'zod';
import {
    CreateUserInputTypeSchema,
    ForgotPasswordInputTypeSchema,
    LoginUserInputTypeSchema,
    ResetPasswordInputTypeSchema,
    UpdateUserInputTypeSchema,
} from '../validation';

export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other',
}

export enum UserRole {
    Admin = 'Admin',
    User = 'User',
    Host = 'Host',
    Guest = 'Guest',
}

export type LoginUserInputInferedType = z.infer<typeof LoginUserInputTypeSchema>;
export type CreateUserInputInferedType = z.infer<typeof CreateUserInputTypeSchema>;
export type UpdateUserInputInferedType = z.infer<typeof UpdateUserInputTypeSchema>;
export type ForgotPasswordInputInferedType = z.infer<typeof ForgotPasswordInputTypeSchema>;
export type ResetPasswordInputInferedType = z.infer<typeof ResetPasswordInputTypeSchema>;
