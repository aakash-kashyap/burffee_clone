var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    fullname: String,
    gender: String,
    blogpost: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Blogpost"
            }],
    followers:[{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
             }],
    follows: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);