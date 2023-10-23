import { gql } from '@apollo/client';

export const GET_MOVIE_ENTRIES = gql`
  query MovieEntries {
    movieEntries {
      id
      title
      stars
      description
      createdAt
      updatedAt
      user
    }
  }
`;

export const GET_MOVIE_ENTRY = gql`
  query MovieEntry($movieEntryId: ID!) {
    movieEntry(id: $movieEntryId) {
      id
      title
      description
      stars
    }
  }
`;
