import { gql } from '@apollo/client';

export const DELETE_MOVIE_ENTRY = gql`
  mutation DeleteMovieEntry($deleteMovieEntryId: ID!) {
    deleteMovieEntry(id: $deleteMovieEntryId) {
      id
      title
      description
      stars
      createdAt
      updatedAt
      user
    }
  }
`;

export const CREATE_MOVIE_ENTRY = gql`
  mutation CreateMovieEntry($input: MovieEntryInput!) {
    createMovieEntry(input: $input) {
      id
      title
      description
      stars
      createdAt
      updatedAt
      user
    }
  }
`;

export const UPDATE_MOVIE_ENTRY = gql`
  mutation UpdateMovieEntry(
    $updateMovieEntryId: ID!
    $input: MovieEntryInput!
  ) {
    updateMovieEntry(id: $updateMovieEntryId, input: $input) {
      id
      title
      stars
      description
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($input: LoginInput!) {
    loginUser(input: $input) {
      createdAt
      email
      id
      token
      username
    }
  }
`;
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      email
      createdAt
      token
    }
  }
`;
