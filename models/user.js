var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		minlength: 6,
		maxlength: 10
	},
	fullName: String,
	email: {
		type: String,
		validate: {
			validator: function (v) {
				var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
				return emailRegex.test(v);
			},
			message: props => `${props.value} is not a valid email`
		},
		unique: true
	},
	designation: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);