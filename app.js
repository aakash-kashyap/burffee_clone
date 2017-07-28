var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var expressSanitizer = require("express-sanitizer");
var bodyParser = require('body-parser');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require("passport-local-mongoose");
var methodOverride   = require("method-override");

var indexRoutes = require('./routes/indexRoutes');
var postRoutes = require('./routes/postRoutes');
var commentRoutes = require('./routes/commentRoutes');


var User = require("./models/userModel");


// mongoose.connect("mongodb://localhost/burffee");
mongoose.connect('mongodb://aakash:12345@ds127173.mlab.com:27173/burffeeclone');


var app = express();

app.use(require("express-session")({
   secret: "This is used for encrypting session",
   resave: false,
   saveUninitialized: false 
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.set("view engine" , "ejs");
app.use(express.static(__dirname + "/public"));
app.use(expressSanitizer());



app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





// middelware sending current user info to all routes
app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   next();
});



app.use(indexRoutes);
app.use(postRoutes);
app.use(commentRoutes);


//==============================================================================

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is listening...");
});

