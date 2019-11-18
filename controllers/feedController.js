const { validationResult } = require('express-validator');
const Post = require('../models/postModel');

exports.getPosts = (req, res, next) => {
    res.status(200).json({posts :[
        {
            _id: 1,
            title: "My Post",
            content: "This is my content",
            imageUrl: "images/duck.jpg",
            creator: {
                name: "Babar"
            },
            date: new Date()
        }
    ]})
}

exports.createPost = (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        res.status(422).json({ 
            status: 422,
            message: "Validation failed",
            errors: errors.array()
        })
    }

    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
        title: title,
        content: content,
        imageUrl: 'images/duck.jpg',
        creator: { name: "Babs"}
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
        throw err;
    })

    
}