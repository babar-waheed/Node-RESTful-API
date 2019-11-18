const { validationResult } = require('express-validator');

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

    res.status(201).json({
        message: "Post created successfully!",
        post: { 
            _id: new Date().toISOString(),
            title: title,
            content: content,
            creator: {
                name: "Babar"
            },
            createdAt: new Date()
        }
    })
}