// Import the "gql" function from the "graphql-tag" library
// This function is used to parse GraphQL query strings into the standard GraphQL syntax
// https://www.npmjs.com/package/graphql-tag
const gql = require('graphql-tag')

// Define the "userType" GraphQL schema using the "gql" function
const userType = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String!
    token: String
  }

  input CreateUserInput {
    username: String!
    email: String!
    password: String!
  }

  input UpdateUserInput {
    username: String
    email: String
    password: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    getUser(id: ID!): User
    getUsers: [User]
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): User
    loginUser(input: LoginInput!): User
  }
`;

// Export the "userType" schema so that it can be used by other modules
module.exports = userType;
