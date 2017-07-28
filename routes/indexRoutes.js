var express = require('express');
var router = express.Router();

var passport = require('passport');


var User = require("../models/userModel");
var Blogpost = require('../models/postModel');




//Middelware to check login status
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/welcome");
}


//----------------------------login routes--------------------------------------
router.get("/login",function(req,res){
    res.render("login");
});


router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}) ,function(req, res){
});

router.get("/logout", function(req,res){ 
    req.logout();
    res.redirect("/");
});




//-----------------------Displays all posts-------------------------------------
router.get("/",isLoggedIn ,function(req,res){
    
    // console.log(req.user);
    Blogpost.find({}, function(err, blogposts){
       
        if(err){
          console.log(err);
        } 
        else{
        //   console.log(blogposts);
          res.render("index",{blogposts: blogposts, tagposts: 0});       
            }
    });
    
});


//==============================================================================

router.get("/home",isLoggedIn ,function(req,res){
    
    
    User.findById(req.user._id).   //find user need to follow
    populate("blogpost").
    populate("followers").
    populate("follows").
    exec(function(err,user){
       if(err){
          console.log(err);
       } else{
        //   console.log(user); 
           User.find({}).populate("followers").populate("follows").exec(function(err, allusers){ //Send all users list
            if(err) 
            {
                console.log(err);
            }
            res.render("home",{user: user, allusers: allusers, blogposts: 0 , tagposts: 0 });
           });
       }
    });
    
});


//==============================================================================

router.get("/welcome",function(req,res){
    res.render("welcome");
});


//==============================================================================
router.get("/register",function(req,res){
    res.render("register");
});

router.post("/register", function(req,res){
    // console.log(req.body);
    User.register(new User({username: req.body.username, 
                            email: req.body.email,
                            fullname: req.body.fullname,
                            gender: req.body.gender}) , req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.render("register");
        }
        passport.authenticate("local")(req,res, function(){
            res.redirect("/");
        });
    });

});

module.exports =router;