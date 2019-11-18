const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');
const Post = require('../models/postModel');

/* GET /feed/posts */
exports.getPosts = (req, res, next) => {

    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;

    Post.find()
    .countDocuments()
    .then(count => {
        totalItems = count;
        return Post.find()
            .skip((currentPage -1) * perPage) 
            .limit(perPage)

    })
    .then(post => {
        res.status(200)
            .json({
                message: "Posts loaded successfully.",
                posts: post,
                totalItems: totalItems
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
        throw new Error('Validation failed');
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
                    post: post
                })
        })  
        .catch(err => {
            next(err)
        })
}

/* PUT /feed/post/postId */
exports.putPost =  (req, res, next) => {

    const id = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;

    console.log("CONTROLLER [PUTPOST]", req.body, id)

    if(req.file){
        console.log("req.file", req.file);

        imageUrl = req.file.path.replace('public/', '');
        console.log("req.file.path", imageUrl);
    }

    Post.findById(id)
        .then(post => {
            console.log("POST", post);
            if(imageUrl !== post.imageUrl){
                clearImage(post.imageUrl)
            }
            post.title = title;
            post.imageUrl = imageUrl;
            post.content = content;
            return post.save();
        })  
        .then(result => {
            res.status(200)
                .json({
                    message: "Post updated successfully!",
                    post: result
                })
        })
        .catch(err => {
            next(err)
        })
}

/* DELETE /feed/post/postId */
exports.deletePost =  (req, res, next) => {

    console.log('[Deleting Post]');
    const id = req.params.postId;

    Post.findById(id)
    .then(post => {
        //check logged in user TODO
        clearImage(post.imageUrl);
        return Post.findByIdAndRemove(id)
    })
    .then(result => {
        res.status(200)
                .json({
                    message: "Post deleted successfully!",
                    post: result
                })
    })
    .catch(err => {
        console.log(err);    
        next(err);
    })
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '../public', filePath)
    console.log("[filePath]", filePath)
    fs.unlink(filePath, err => {
        console.log(err);
    });
}