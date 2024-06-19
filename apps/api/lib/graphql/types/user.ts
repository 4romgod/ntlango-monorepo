import 'reflect-metadata';
import {USER_DESCRIPTIONS} from '@/constants';
import {ID, ObjectType, InputType, Field, registerEnumType, Authorized} from 'type-graphql';
import {Document} from 'mongoose';

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

registerEnumType(Gender, {
    name: 'Gender',
    description: USER_DESCRIPTIONS.GENDER,
});

registerEnumType(UserRole, {
    name: 'UserRole',
    description: USER_DESCRIPTIONS.USER_ROLE,
});

@ObjectType({description: USER_DESCRIPTIONS.TYPE})
export class UserType {
    @Field((type) => ID, {description: USER_DESCRIPTIONS.ID})
    userId: string;

    @Field({description: USER_DESCRIPTIONS.EMAIL})
    email: string;

    @Field({description: USER_DESCRIPTIONS.USERNAME})
    username: string;

    @Field({description: USER_DESCRIPTIONS.ADDRESS})
    address: string;

    @Field({description: USER_DESCRIPTIONS.BIRTHDATE})
    birthdate: string;

    @Field({description: USER_DESCRIPTIONS.GIVEN_NAME})
    given_name: string;

    @Field({description: USER_DESCRIPTIONS.FAMILY_NAME})
    family_name: string;

    @Field(() => Gender, {nullable: true, description: USER_DESCRIPTIONS.GENDER})
    gender?: Gender;

    @Field({nullable: true, description: USER_DESCRIPTIONS.PHONE_NUMBER})
    phone_number?: string;

    @Field({nullable: true, description: USER_DESCRIPTIONS.PROFILE_PICTURE})
    profile_picture?: string;

    @Field(() => UserRole, {description: USER_DESCRIPTIONS.USER_ROLE})
    userRole: UserRole;
}

@ObjectType({description: USER_DESCRIPTIONS.WITH_TOKEN})
export class UserWithTokenType extends UserType {
    @Field({description: USER_DESCRIPTIONS.TOKEN})
    token: string;
}

export interface UserTypeDocument extends UserType, Document {
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

@InputType({description: USER_DESCRIPTIONS.CREATE_INPUT})
export class CreateUserInputType {
    @Field({description: USER_DESCRIPTIONS.EMAIL})
    email: string;

    @Field({nullable: true, description: USER_DESCRIPTIONS.USERNAME})
    username?: string;

    @Field({description: USER_DESCRIPTIONS.ADDRESS})
    address: string;

    @Field({description: USER_DESCRIPTIONS.BIRTHDATE})
    birthdate: string;

    @Field({description: USER_DESCRIPTIONS.GIVEN_NAME})
    given_name: string;

    @Field({description: USER_DESCRIPTIONS.FAMILY_NAME})
    family_name: string;

    @Field(() => Gender, {nullable: true, description: USER_DESCRIPTIONS.GENDER})
    gender?: Gender;

    @Field({description: USER_DESCRIPTIONS.PASSWORD})
    password: string;

    @Field({nullable: true, description: USER_DESCRIPTIONS.PHONE_NUMBER})
    phone_number?: string;

    @Field({nullable: true, description: USER_DESCRIPTIONS.PROFILE_PICTURE})
    profile_picture?: string;
}

@InputType({description: USER_DESCRIPTIONS.UPDATE_INPUT})
export class UpdateUserInputType {
    @Field((type) => ID, {description: USER_DESCRIPTIONS.ID})
    userId: string;

    @Field({nullable: true, description: USER_DESCRIPTIONS.EMAIL})
    email?: string;

    @Field({nullable: true, description: USER_DESCRIPTIONS.USERNAME})
    username?: string;

    @Field({nullable: true, description: USER_DESCRIPTIONS.ADDRESS})
    address?: string;

    @Field({nullable: true, description: USER_DESCRIPTIONS.BIRTHDATE})
    birthdate?: string;

    @Field({nullable: true, description: USER_DESCRIPTIONS.GIVEN_NAME})
    given_name?: string;

    @Field({nullable: true, description: USER_DESCRIPTIONS.FAMILY_NAME})
    family_name?: string;

    @Field(() => Gender, {nullable: true, description: USER_DESCRIPTIONS.GENDER})
    gender?: Gender;

    @Field({nullable: true, description: USER_DESCRIPTIONS.PASSWORD})
    password?: string;

    @Field({nullable: true, description: USER_DESCRIPTIONS.PHONE_NUMBER})
    phone_number?: string;

    @Field({nullable: true, description: USER_DESCRIPTIONS.PROFILE_PICTURE})
    profile_picture?: string;

    @Authorized([UserRole.Admin])
    @Field(() => UserRole, {nullable: true, description: USER_DESCRIPTIONS.USER_ROLE})
    userRole?: string;
}

// TODO make this also work with username
@InputType({description: USER_DESCRIPTIONS.LOGIN_INPUT})
export class LoginUserInputType {
    @Field({description: USER_DESCRIPTIONS.EMAIL})
    email: string;

    @Field({description: USER_DESCRIPTIONS.PASSWORD})
    password: string;
}
