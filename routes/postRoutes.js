var express = require('express');
var router = express.Router();


var User = require("../models/userModel");
var Blogpost = require('../models/postModel');




//Middelware to check login status
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/welcome");
}

//--------------create new post-------------------------------------------------

router.get("/publish",isLoggedIn,function(req,res){
    res.render("publish");
});

router.post("/publish",isLoggedIn,function(req,res){
//   console.log(req.body); 
   
    req.body.post.content = req.sanitize(req.body.post.content);
    req.body.post.tag = req.body.post.tag.toLowerCase();

    Blogpost.create(req.body.post, function(err,newBlogpost){
     
     if(err){
         console.log("Error creating post.."+ err);
         res.render("publish");
        } else{
            
        newBlogpost.author.username = req.user.username;
        newBlogpost.author.id = req.user._id;
        newBlogpost.save();
        
        req.user.blogpost.push(newBlogpost);
        req.user.save();
        
         console.log("-------------------New blog -----------------------");
         console.log(req.user);
        
         res.redirect("/");
     }
    });
    
});



router.get("/hometag/:tag",isLoggedIn, function(req,res){
    // console.log( req.params.tag);
    
    Blogpost.find({tag: req.params.tag.toLowerCase()}, function(err, tagposts){
    
        if(err){
          console.log("Error");
        } 
        else{
            console.log("---------"+ req.params.tag.toLowerCase() + "------------");    
            console.log(tagposts);
            res.render("home",{user: 0, allusers: 0 , tagposts: tagposts});
        }
    });
});

router.get("/globaltag/:tag",isLoggedIn, function(req,res){
    // console.log( req.params.tag);
    
    Blogpost.find({tag: req.params.tag.toLowerCase()}, function(err, tagposts){
    
        if(err){
          console.log("Error");
        } 
        else{
            console.log("---------"+ req.params.tag.toLowerCase() + "------------");    
            console.log(tagposts);
            res.render("index",{tagposts: tagposts , blogposts: 0});
        }
    });
});

//==============================================================================


//-----------add follower to current user---------------------------------------

router.post("/user/add/:id",isLoggedIn,function(req,res){
    
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err);
        }
        else{
            // console.log("==========Current user=======");
            // console.log(user);
            req.user.follows.push(user);
            req.user.save();
            
            user.followers.push(req.user);
            user.save();
            
            res.redirect("/");
        }
    });
    
});


//------------------Show Expanded Post------------------------------------------ 
router.get("/post/:id",isLoggedIn, function(req,res){
    console.log(req.params.id);
    
    Blogpost.findById(req.params.id ).populate('comments').exec(function(err, blogpost){
        if(err) console.log(err);
        
        res.render("showPost",{blogpost: blogpost});    
    });

});

//--------------------Edit Post-------------------------------------------------

router.get("/post/:id/edit",isLoggedIn, function(req,res){
   Blogpost.findById(req.params.id , function(err, blogpost){
      if(err) console.log(err);
      res.render("edit", {blogpost: blogpost});
   });
    
});


//----------------------Update Post --------------------------------------------

router.put("/post/:id",isLoggedIn,function(req,res){
    req.body.post.content = req.sanitize(req.body.post.content);
    req.body.post.tag = req.body.post.tag.toLowerCase();
    
    Blogpost.findByIdAndUpdate(req.params.id , req.body.post , function(err,blogpost){
       if(err){
         console.log(err);
         res.redirect("/post/"+ req.params.id + "/edit");
       } 
       
        res.redirect("/post/"+req.params.id);
       
    });
});

//---------------------------Delete Post----------------------------------------

router.delete("/post/:id",isLoggedIn,function(req,res){
   
   Blogpost.findByIdAndRemove(req.params.id, req.body.post, function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            //redirect to index page
            res.redirect("/");
        }
    });   
});


module.exports =router;