const { validationResult } = require('express-validator');
const Post = require('../models/postModel');

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

exports.createPost = (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ 
            status: 422,
            message: "Validation failed",
            errors: errors.array()
        })
    }

    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
        // title: title,
        content: content,
        imageUrl: 'images/duck.jpg',
        creator: { name: "Babs"},
        test: "AFD"
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