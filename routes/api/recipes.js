const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");

const Recipes = require("../../models/Recipes");
const User = require("../../models/User");

// @route   POST api/recipes
// @desc    Create a recipe
// @access  Private
router.post(
	"/",
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
		try {
			const user = await User.findById(req.user.id).select("-password");

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

			const newRecipe = new Recipes({});
			// not required fields
			if (favorite) {
				newRecipe.favorite = favorite;
			} else {
				newRecipe.favorite = false;
			}
			if (rating) newRecipe.rating = rating;
			if (notes) newRecipe.notes = notes;
			if (reviews) newRecipe.reviews = reviews;

			// required fields
			newRecipe.title = title;
			newRecipe.category = category;
			newRecipe.author = author;
			newRecipe.difficulty = difficulty;
			newRecipe.prepTime = prepTime;
			newRecipe.cookTime = cookTime;
			newRecipe.totalTime = prepTime + cookTime;
			newRecipe.servings = servings;
			newRecipe.ingredients = ingredients;
			newRecipe.directions = directions;
			newRecipe.keywords = keywords;
			newRecipe.firstName = user.firstName;
			newRecipe.lastName = user.lastName;
			newRecipe.user = req.user.id;

			const recipe = await newRecipe.save();
			res.json(recipe);
		} catch (error) {
			console.error(err);
			res.status(500).send("Server Error");
		}
	}
);

// @route   GET api/recipes
// @desc    Get recipes
// @access  Private
router.get("/", auth, async (req, res) => {
	try {
		const recipes = await Recipes.find().sort({ date: -1 });
		res.json(recipes);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server Error");
	}
});

// @route   GET api/recipes/:id
// @desc    Get single recipe by id
// @access  Private
router.get("/:id", auth, async (req, res) => {
	try {
		const recipe = await Recipes.findById(req.params.id);

		if (!recipe) {
			return res.status(404).json({ msg: "Recipe not found" });
		}
		res.json(recipe);
	} catch (err) {
		console.error(err);
		if (err.kind === "ObjectId") {
			return res.status(404).json({ msg: "Recipe not found" });
		}
		res.status(500).send("Server Error");
	}
});

// @route   DELETE api/recipes/:id
// @desc    Delete recipe by id
// @access  Private
router.delete("/:id", auth, async (req, res) => {
	try {
		const recipe = await Recipes.findById(req.params.id);

		if (!recipe) {
			return res.status(404).json({ msg: "Recipe not found" });
		}

		await recipe.remove();

		res.json({ msg: "Recipe was successfully deleted" });
	} catch (err) {
		console.error(err);
		if (err.kind === "ObjectId") {
			return res.status(404).json({ msg: "Recipe not found" });
		}
		res.status(500).send("Server Error");
	}
});

module.exports = router;
