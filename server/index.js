// Import required external modules
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const glob = require('glob');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
//Database connection function
const { connect } = require('./helpers/connection.js');
//Config Setup
require('dotenv').config();
const config = require('config');

// Get appPrivateKey and dbConnectionString from config
const appEnv = config.get('appEnv');
const appPrivateKey = config.get('appPrivateKey');
const dbName = config.get('db.name');
const dbConnectionString = config.get('db.connectionString');

// Check that appPrivateKey and dbConnectionString are defined
if (!appPrivateKey && dbConnectionString) {
  console.error('FATAL ERROR: APP_PRIVATE_KEY is not defined and or DB_CONNECTION_STRING is not defined');
  process.exit(1);
}

// Load GraphQL type definitions and resolvers
const resolvers = glob.sync('graphql/*/*-resolver.js');
const registerResolvers = resolvers.map((resolver) => require(`./${resolver}`));
const types = glob.sync('graphql/*/*-type.js');
const registerTypes = types.map((type) => require(`./${type}`));

// Merge type definitions and resolvers
const typeDefsMerged = mergeTypeDefs(registerTypes);
const resolversMerged = mergeResolvers(registerResolvers);

// Define the startServer function
async function startServer() {
  // Create a new Apollo Server instance
  const server = new ApolloServer({
    typeDefs: typeDefsMerged,
    resolvers: resolversMerged,
    // Define the formatError function to format errors - Removes stack trace in anything but development
    formatError: (error) => {
      const { message, extensions } = error;
      //Call to Logger could go here
      if (appEnv !== 'development') {
        // In production, remove the stack trace from the error
        delete extensions.stacktrace;
      }
      return { message, extensions };
    },
  });

  // Connect to the database
  const databaseName = dbName;
  connect(`${dbConnectionString}${databaseName}`);

  // Start the server and get the server URL
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    // Define a context function to add the user to the context
    context: async ({ req, res }) => {
      try {
        // Get the user token from the headers
        const token = req.headers.authorization || '';
        if (!token) return;
        // Try to retrieve a user with the token

        const user = jwt.verify(token, appPrivateKey); // Decodes the token
        if (!user) {
          throw new Error('User not found');
        }
        // Add the user to the context
        return { user };
      } catch (error) {
        throw new GraphQLError(error, {
          extensions: {
            code: 'JWT_DECODE_ERROR',
          },
        });
      }
    },

  });

  // Log the server URL
  console.log(`🚀 Server ready at ${url}`);
}

// Call the startServer function to start the server
startServer();