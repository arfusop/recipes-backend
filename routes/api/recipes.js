const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");

const Recipes = require("../../models/Recipes");
const User = require("../../models/User");

// @route   GET api/recipes
// @desc    Get all recipes
// @access  Public
router.get("/", async (req, res) => {
	try {
		const recipes = await Recipes.find().populate("user", [
			"firstName",
			"lastName"
		]);

		res.json(recipes);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server Error");
	}
});

// @route   POST api/recipes/new
// @desc    Create a users recipes
// @access  Private
router.post(
	"/new",
	[
		auth,
		[
			check("title", "A title is required")
				.not()
				.isEmpty(),
			check("category", "A category is required")
				.not()
				.isEmpty(),
			check("author", "An author is required")
				.not()
				.isEmpty(),
			check("difficulty", "A difficulty level is required")
				.not()
				.isEmpty(),
			check("prepTime", "Prep time is required")
				.not()
				.isEmpty(),
			check("cookTime", "Cook time is required")
				.not()
				.isEmpty(),
			check("servings", "Serving size is required")
				.not()
				.isEmpty(),
			check("ingredients", "Ingredients are required")
				.not()
				.isEmpty(),
			check("directions", "Directions are required")
				.not()
				.isEmpty(),
			check("keywords", "Keywords are required")
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			title,
			category,
			author,
			favorite,
			difficulty,
			prepTime,
			cookTime,
			servings,
			rating,
			ingredients,
			directions,
			keywords,
			reviews,
			notes
		} = req.body;

		const recipeFields = {};

		// not required fields
		if (favorite) {
			recipeFields.favorite = favorite;
		} else {
			recipeFields.favorite = false;
		}
		if (rating) recipeFields.rating = rating;
		if (notes) recipeFields.notes = notes;
		if (reviews) recipeFields.reviews = reviews;

		// required fields
		recipeFields.title = title;
		recipeFields.category = category;
		recipeFields.author = author;
		recipeFields.difficulty = difficulty;
		recipeFields.prepTime = prepTime;
		recipeFields.cookTime = cookTime;
		recipeFields.totalTime = prepTime + cookTime;
		recipeFields.servings = servings;
		recipeFields.ingredients = ingredients;
		recipeFields.directions = directions;
		recipeFields.keywords = keywords;

		try {
			let recipe = await Recipes.findOne({ user: req.user.id });

			recipe = new Recipes(recipeFields);

			await recipe.save();
			res.json(recipe);
		} catch (err) {
			console.error(err);
			res.status(500).send("Server Error");
		}
	}
);

// @route   POST api/recipes/user/:user_id/:recipe_id
// @desc    Edit an existing recipe
// @access  Private
router.post(
	"/user/:user_id/:recipe_id",
	[
		auth,
		[
			check("title", "A title is required")
				.not()
				.isEmpty(),
			check("category", "A category is required")
				.not()
				.isEmpty(),
			check("author", "An author is required")
				.not()
				.isEmpty(),
			check("difficulty", "A difficulty level is required")
				.not()
				.isEmpty(),
			check("prepTime", "Prep time is required")
				.not()
				.isEmpty(),
			check("cookTime", "Cook time is required")
				.not()
				.isEmpty(),
			check("servings", "Serving size is required")
				.not()
				.isEmpty(),
			check("ingredients", "Ingredients are required")
				.not()
				.isEmpty(),
			check("directions", "Directions are required")
				.not()
				.isEmpty(),
			check("keywords", "Keywords are required")
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			title,
			category,
			author,
			favorite,
			difficulty,
			prepTime,
			cookTime,
			servings,
			rating,
			ingredients,
			directions,
			keywords,
			reviews,
			notes
		} = req.body;

		const recipeFields = {};

		// not required fields
		if (favorite) {
			recipeFields.favorite = favorite;
		} else {
			recipeFields.favorite = false;
		}
		if (rating) recipeFields.rating = rating;
		if (notes) recipeFields.notes = notes;
		if (reviews) recipeFields.reviews = reviews;

		// required fields
		recipeFields.title = title;
		recipeFields.category = category;
		recipeFields.author = author;
		recipeFields.difficulty = difficulty;
		recipeFields.prepTime = prepTime;
		recipeFields.cookTime = cookTime;
		recipeFields.totalTime = prepTime + cookTime;
		recipeFields.servings = servings;
		recipeFields.ingredients = ingredients;
		recipeFields.directions = directions;
		recipeFields.keywords = keywords;

		try {
			let recipe = await Recipes.findOne({
				user: req.params.user_id,
				recipe: req.params.recipe_id
			});

			// recipe = new Recipes(recipeFields);

			// await recipe.save();
			res.json(recipe);
		} catch (err) {
			console.error(err);
			res.status(500).send("Server Error");
		}
	}
);

// @route   GET api/recipes/user/:user_id/:recipe_id
// @desc    Edit an existing recipe
// @access  Public
// router.get("/user/:user_id/:recipe_id", async (req, res) => {
router.get("/user/:user_id:recipe_id", async (req, res) => {
  console.log(req.params);
	try {
		let recipe = await Recipes.findOne({
			user: req.params.user_id,
			recipes: req.params.recipe_id
		}).populate("user", ["firstName", "lastName"]);

		if (!recipe) return res.status(400).json({ msg: "Recipe not found" });

		res.json(recipe);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
