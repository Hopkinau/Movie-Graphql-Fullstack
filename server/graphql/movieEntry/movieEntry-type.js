const gql = require('graphql-tag');

const MovieEntryType = gql`
  type MovieEntry {
    id: ID!
    title: String!
    description: String!
    stars: Int!
    createdAt: String!
    updatedAt: String!
    user: ID!
  }

  input MovieEntryInput {
    title: String!
    description: String!
    stars: Int!
    user: ID!
  }

  type MovieEntryMutationResponse {
    id: ID!
    title: String!
    description: String!
    stars: Int!
    createdAt: String!
    updatedAt: String!
    user: ID!
  }

  type Query {
    movieEntry(id: ID!): MovieEntry
    movieEntries: [MovieEntry]
    searchMovieEntries(title: String!): [MovieEntry]
  }

  type Mutation {
    createMovieEntry(input: MovieEntryInput!): MovieEntryMutationResponse!
    updateMovieEntry(
      id: ID!
      input: MovieEntryInput!
    ): MovieEntryMutationResponse!
    deleteMovieEntry(id: ID!): MovieEntryMutationResponse!
  }
`;

module.exports = MovieEntryType;
