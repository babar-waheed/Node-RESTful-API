var express = require('express');
const { body } = require('express-validator');

var router = express.Router();
const feedController = require('../controllers/feedController');

/* GET /feed/posts */
router.get('/posts', feedController.getPosts);

/* POST /feed/posts */
router.post('/post', [
    body('title')
    .trim()
    .isLength({min: 5}),
    body('content')
    .trim()
    .isLength({min: 5})
],feedController.createPost);

module.exports = router;