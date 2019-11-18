const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');

const router = express.Router();
const feedController = require('../controllers/feedController');

/* GET /feed/posts */
router.get('/posts', isAuth, feedController.getPosts);

/* POST /feed/posts */
router.post('/post', isAuth,[ 
    body('title')
    .trim()
    .isLength({min: 5}),
    body('content')
    .trim()
    .isLength({min: 5})
],feedController.createPost);

/* GET /feed/post/postId */
router.get('/post/:postId', isAuth, feedController.getPost);

/* PUT /feed/post/postId */
router.put('/post/:postId', isAuth, [
    body('title')
    .trim()
    .isLength({min: 5}),
    body('content')
    .trim()
    .isLength({min: 5})
],feedController.putPost);

/* DELETE /feed/post/postId */
router.delete('/post/:postId',feedController.deletePost);

module.exports = router;