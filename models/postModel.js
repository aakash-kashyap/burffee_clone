var mongoose = require("mongoose");


var PostSchema = new mongoose.Schema({
    title: String,
    tag: String,
    content:  String,
    created:  {type: Date, default: Date.now },
    author: {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                    },
                username: String
            },
    comments: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }]
    
    });



module.exports = mongoose.model("Blogpost", PostSchema);