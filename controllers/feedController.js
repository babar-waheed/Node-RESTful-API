const { validationResult } = require('express-validator');
const Post = require('../models/postModel');

/* GET /feed/posts */
exports.getPosts = (req, res, next) => {

    Post.find()
        .then(post => {
            res.status(200)
                .json({
                    status: req.status,
                    posts: post
                })
        })  
        .catch(err => {
            next(err)
        })
}

/* POST /feed/posts */
exports.createPost = (req, res, next) => {

    console.log("[CREATING POST]", req.file);
    const errors = validationResult(req);
    if(!errors.isEmpty() || !req.file){
        return res.status(422).json({ 
            message: "Validation failed",
            errors: errors
        })
    }

    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path.replace('public/', '');

    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: { name: "Babs"},
    })
    post.save()
    .then(result => {
        console.log("CONTROLLER:[feed.js][createPost]", result);
        res.status(201).json({
            message: "Post created successfully!",
            post: result
        })

    })
    .catch(err => {
        next(err);
    })
    
}

/* GET /feed/post/postId */
exports.getPost =  (req, res, next) => {
    const id = req.params.postId;

    Post.findById(id)
        .then(post => {
            res.status(200)
                .json({
                    status: req.status,
                    post: post
                })
        })  
        .catch(err => {
            next(err)
        })
}