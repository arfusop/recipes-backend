const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user"
	},
	dob: {
		type: String,
		required: true
	},
	foodAllergies: {
		type: [String]
	},
	diets: {
		type: [String]
	},
	cookingSkill: {
		type: String
	},
	houseHoldSize: {
		type: Number,
		required: true
	},
	gender: {
		type: String,
		required: true
	},
	profilePic: {
		small: String,
		large: String,
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
