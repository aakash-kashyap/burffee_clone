var express = require('express');
var router = express.Router();

var Blogpost = require('../models/postModel');
var Comment= require('../models/commentModel');


//Middelware to check login status
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/welcome");
}


//-----------------------Add Comments to the post-------------------------------

router.post("/post/:id/comment",isLoggedIn, function(req,res){
    
    Blogpost.findById(req.params.id, function(err, blogpost){
       if(err) {
           console.log(err);
           res.redirect("/post/"+ req.params.id);
       }else{
           
           Comment.create(req.body.comment, function(err, comment){
              if(err){
                  console.log(err);
              }else{
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.save();
                  
                  blogpost.comments.push(comment);
                  blogpost.save();
                  res.redirect("/post/"+ req.params.id);
              } 
           });
           
       }
       
    });
});

module.exports =router;