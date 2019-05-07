const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  favorite: {
    type: Boolean,
  },
  difficulty: {
    type: Number,
    required: true,
  },
  prepTime: {
    type: Number,
    required: true,
  },
  cookTime: {
    type: Number,
    required: true,
  },
  totalTime: {
    type: Number,
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  rating: {
    type: String,
  },
  ingredients: {
    type: Array,
    required: true,
  },
  directions: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  keywords: {
    type: String,
    required: true,
  },
  reviews: {
    type: Array,
  },
});

module.exports = User = mongoose.model('recipes', RecipeSchema);