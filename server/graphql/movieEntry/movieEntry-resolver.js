// Import necessary modules and models
const { MovieEntry, validateMovieEntry } = require('../../models/movieEntry');
const { GraphQLError } = require('graphql');

// Define the MovieEntryResolver object, which contains resolvers for the MovieEntryType, Query, and Mutation types
const movieEntryResolver = {
  Query: {
    movieEntry: async (parent, args, context) => {
      try {
        // Check if the user is authenticated
        isAuthenticated(context);
        // Find the Movie entry to delete by its ID
        let movieEntry = await MovieEntry.findById(args.id);
        if (!movieEntry) {
          // If the Movie entry doesn't exist, throw an Error
          throw new Error('Movie entry not found');
        }
        // Check if the user is authorized to delete the Movie entry
        isAuthorized(movieEntry, context);

        return movieEntry;
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'GET_MOVIE_ENTRY_ERROR',
          },
        });
      }
    },
    movieEntries: async (parent, args, context) => {
      try {
        // Check if the user is authenticated
        isAuthenticated(context);
        // Find all Movie entries
        return await MovieEntry.find({ user: context.user._id });
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'GET_MOVIE_ENTRIES_ERROR',
          },
        });
      }
    },
    searchMovieEntries: async (parent, args) => {
      try {
        // Find all Movie entries that match the title provided in the query arguments
        return await MovieEntry.find({
          title: new RegExp('^' + args.title + '$', 'i'),
        });
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'SEARCH_MOVIE_ENTRIES_ERROR',
          },
        });
      }
    },
  },
  // Resolvers for the "addMovieEntry", "editMovieEntry", and "deleteMovieEntry" mutations
  Mutation: {
    createMovieEntry: async (parent, args, context) => {
      try {
        // Check if the user is authenticated
        isAuthenticated(context);
        // Validate the input data using the validateMusicEntry function
        const { error } = validateMovieEntry(args.input);
        if (error) {
          // If the input data is invalid, throw an Error
          throw new Error('Invalid input data');
        }
        // Create a new Movie entry using the input data
        const movieEntry = new MovieEntry({
          title: args.input.title,
          description: args.input.description,
          stars: args.input.stars,
          user: context.user._id,
        });
        // Save the new Movie entry to the database
        await movieEntry.save();
        // Return the new movie entry
        return movieEntry;
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'CREATE_MOVIE_ENTRY_ERROR',
          },
        });
      }
    },
    updateMovieEntry: async (parent, args, context) => {
      try {
        // Check if the user is authenticated
        isAuthenticated(context);
        // Find the Movie entry to update by its ID
        let movieEntry = await MovieEntry.findById(args.id);
        if (!movieEntry) {
          // If the Movie entry doesn't exist, throw an Error
          throw new Error('Movie entry not found 1');
        }
        // Check if the user is authorized to edit the Movie entry
        isAuthorized(movieEntry, context);
        // Update the movie entry with the input data
        movieEntry.title = args.input.title;
        movieEntry.description = args.input.description;
        movieEntry.stars = args.input.stars;
        // Save the updated movie entry to the database
        return await movieEntry.save();
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'UPDATE_MOVIE_ENTRY_ERROR',
          },
        });
      }
    },
    deleteMovieEntry: async (parent, args, context) => {
      try {
        // Check if the user is authenticated
        isAuthenticated(context);

        // Find the Movie entry to delete by its ID
        let movieEntry = await MovieEntry.findById(args.id);
        if (!movieEntry) {
          // If the movie entry doesn't exist, throw an Error
          throw new Error('movie entry not found');
        }
        // Check if the user is authorized to delete the movie entry
        isAuthorized(movieEntry, context);
        // Delete the Movie entry from the database
        await MovieEntry.deleteOne({ _id: args.id });
        // Return a success message and the deleted Movie entry
        movieEntry.id = args.id;
        return movieEntry;
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'DELETE_MOVIE_ENTRY_ERROR',
          },
        });
      }
    },
  },
};

function isAuthenticated(context) {
  if (!context.user) {
    throw new AuthenticationError('User is not authenticated');
  }
}

function isAuthorized(movieEntry, context) {
  if (movieEntry.user.toString() !== context.user._id) {
    throw new ApolloError(
      'User is not authorized to edit this movie entry',
      'FORBIDDEN',
      {
        httpStatusCode: 403,
      }
    );
  }
}
// Export the movieEntryResolver object
module.exports = movieEntryResolver;
