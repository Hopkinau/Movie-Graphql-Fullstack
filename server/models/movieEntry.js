const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const movieEntrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    description: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 5000,
    },
    stars: {
      type: Number,
      min: 0,
      max: 4,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const MovieEntry = mongoose.model('MovieEntry', movieEntrySchema);

// Define a function that validates movie entry input using Joi
function validateMovieEntry(movieEntry) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(3).max(5000).required(),
    stars: Joi.number().integer().min(0).max(5).required(),
    user: Joi.objectId().required(),
  });
  return schema.validate(movieEntry);
}

module.exports.MovieEntry = MovieEntry;
module.exports.validateMovieEntry = validateMovieEntry;
