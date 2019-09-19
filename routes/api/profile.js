const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Private
router.get("/me", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate(
			"user",
			["firstName", "lastName"]
		);

		if (!profile) {
			return res.status(400).json({ msg: "There is no profile for this user" });
		}

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route   POST api/profile
// @desc    Create or update a user profile
// @access  Private
router.post(
	"/",
	[
		auth,
		[
			check("dob", "Date of birth is required")
				.not()
				.isEmpty(),
			check("houseHoldSize", "House hold size is required")
				.not()
				.isEmpty(),
			check("gender", "Gender is required")
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
			dob,
			foodAllergies,
			diets,
			cookingSkill,
			houseHoldSize,
			gender,
			profilePic
		} = req.body;

		const profileFields = {};
		profileFields.user = req.user.id;
		if (cookingSkill) profileFields.cookingSkill = cookingSkill;
		profileFields.dob = dob;
		profileFields.houseHoldSize = houseHoldSize;
		profileFields.gender = gender;
		profileFields.profilePic = profilePic;
		if (foodAllergies) {
			profileFields.foodAllergies = foodAllergies
				.split(",")
				.map(skill => skill.trim());
		}
		if (diets) {
			profileFields.diets = diets.split(",").map(diet => diet.trim());
		}

		try {
			let profile = await Profile.findOne({ user: req.user.id });

			if (profile) {
				// if profile exists, we want to update instead of create new
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				);

				return res.json(profile);
			}

			// create new profile
			profile = new Profile(profileFields);

			await profile.save();
			res.json(profile);
		} catch (err) {
			console.error(err);
			res.status(500).send("Server Error");
		}
	}
);

// @route   GET api/profile
// @desc    GET all profiles
// @access  Public
router.get("/", async (req, res) => {
	try {
		const profiles = await Profile.find().populate("user", [
			"firstName",
			"lastName"
		]);

		res.json(profiles);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server Error");
	}
});

// @route   GET api/profile/user/:user_id
// @desc    GET profile by user ID
// @access  Public
router.get("/user/:user_id", async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id
		}).populate("user", ["firstName", "lastName"]);

		if (!profile) return res.status(400).json({ msg: "Profile not found." });

		res.json(profile);
	} catch (err) {
		console.error(err);
		if (err.kind == "ObjectId") {
			return res.status(400).json({ msg: "Profile not found." });
		}
		res.status(500).send("Server Error");
	}
});

// @route   DELETE api/profile
// @desc    Delete profile, user & recipes
// @access  Public
router.delete("/", auth, async (req, res) => {
	try {
		// @todo - remove users recipes

		// remove profile
		await Profile.findOneAndRemove({ user: req.user.id });

		// remove user
		await User.findOneAndRemove({ _id: req.user.id });
		res.json({ msg: "User deleted" });
	} catch (err) {
		console.error(err);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
