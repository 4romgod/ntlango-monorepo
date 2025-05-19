import { graphql } from '@/data/graphql/types';

export const RegisterUserDocument = graphql(`
  mutation RegisterUser($input: CreateUserInputType!) {
    createUser(input: $input) {
      userId
      email
      username
      bio
      address
      birthdate
      given_name
      family_name
      gender
      phone_number
      profile_picture
      userRole
      token
      interests {
        eventCategoryId
        slug
        name
        iconName
        description
        color
      }
    }
  }
`);

export const LoginUserDocument = graphql(`
  mutation LoginUser($input: LoginUserInputType!) {
    loginUser(input: $input) {
      userId
      email
      username
      bio
      address
      birthdate
      given_name
      family_name
      gender
      phone_number
      profile_picture
      userRole
      token
      interests {
        eventCategoryId
        slug
        name
        iconName
        description
        color
      }
    }
  }
`);

export const UpdateUserDocument = graphql(`
  mutation UpdateUser($input: UpdateUserInputType!) {
    updateUser(input: $input) {
      userId
      email
      username
      bio
      address
      birthdate
      given_name
      family_name
      gender
      phone_number
      profile_picture
      userRole
      interests {
        eventCategoryId
        slug
        name
        iconName
        description
        color
      }
    }
  }
`);
