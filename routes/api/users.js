const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");

// @route   POST api/post
// @desc    Register user
// @access  Public
router.post(
	"/",
	[
		check("firstName", "First name is required")
			.not()
			.isEmpty(),
		check("lastName", "Last name is required")
			.not()
			.isEmpty(),
		check("email", "Please include a valid email").isEmail(),
		check(
			"password",
			"Please enter a password with 6 or more characters"
		).isLength({ min: 6 })
	],
	async (req, res) => {
    const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { firstName, lastName, email, password } = req.body;

		try {
			// 1. See if user already exists
			let user = await User.findOne({ email });
			if (user) {
				return res.status(400).json({ errors: [{ msg: "User already exists" }] });
			}

			user = new User({
				firstName,
				lastName,
				email,
				password
			});

			// 2. Encrypt password using Bcrypt
			const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

			// 3. Return json webtoken

      // 4. DEBUG node error on submit of new user...
			res.send("User registered");
		} catch (err) {
			console.log(err.message);
			res.status(500).send("Server Error");
		}
	}
);

module.exports = router;
