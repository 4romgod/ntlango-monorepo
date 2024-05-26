import {z} from 'zod';
import {REGEX_DATE, REGEX_EMAIL, REGEX_PHONE_NUMBER} from '../../../constants';
import {isEmpty} from 'lodash';

export const CreateUserInputTypeSchema = z.object({
    address: z.string().nullish(),
    birthdate: z.string().regex(REGEX_DATE, {message: 'Birthdate should be in DD/MM/YYYY format'}),
    email: z.string().email({message: 'Invalid email format'}),
    family_name: z.string().min(1, {message: 'Last name is required'}),
    given_name: z.string().min(1, {message: 'First name is required'}),
    password: z.string().min(8, {message: 'Password should be at least 8 characters long'}),
    phone_number: z
        .string()
        .nullish()
        .refine((value) => isEmpty(value) || (value && REGEX_PHONE_NUMBER.test(value)), {message: 'Invalid phone number format'}),
    profile_picture: z.string().nullish(),
    username: z.string().nullish(),
});

export const UpdateUserInputTypeSchema = z.object({
    address: z.string().nullish(),
    birthdate: z
        .string()
        .nullish()
        .refine((value) => isEmpty(value) || (value && REGEX_DATE.test(value)), {message: 'Birthdate should be in DD/MM/YYYY format'}),
    email: z
        .string()
        .nullish()
        .refine((value) => isEmpty(value) || (value && REGEX_EMAIL.test(value)), {message: 'Invalid email format'}),
    family_name: z
        .string()
        .nullish()
        .refine((value) => isEmpty(value) || (value && value.length >= 2), {message: 'Last name is too short'}),
    given_name: z
        .string()
        .nullish()
        .refine((value) => isEmpty(value) || (value && value.length >= 2), {message: 'First name is too short'}),
    password: z
        .string()
        .nullish()
        .refine((value) => isEmpty(value) || (value && value.length >= 9), {message: 'Password should be at least 8 characters long'}),
    phone_number: z
        .string()
        .nullish()
        .refine((value) => isEmpty(value) || (value && REGEX_PHONE_NUMBER.test(value)), {message: 'Invalid phone number format'}),
    profile_picture: z.string().nullish(),
    username: z
        .string()
        .nullish()
        .refine((value) => isEmpty(value) || (value && value.length >= 3), {message: 'Username is too short'}),
});

export const LoginUserInputTypeSchema = z.object({
    email: z.string().email({message: 'Invalid email format'}),
    password: z.string().min(8, {message: 'Password should be at least 8 characters long'}),
});

export const ForgotPasswordInputTypeSchema = z.object({
    email: z.string().email({message: 'Invalid email format'}),
});

export const ResetPasswordInputTypeSchema = z.object({
    password: z.string().min(8, {message: 'Password should be at least 8 characters long'}),
    'confirm-password': z.string().min(8, {message: 'Password should be at least 8 characters long'}),
});
