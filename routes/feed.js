var express = require('express');
var router = express.Router();
const feedController = require('../controllers/feedController');

/* GET /feed/posts */
router.get('/posts', feedController.getPosts);

/* POST /feed/posts */
router.post('/post', feedController.createPost);

module.exports = router;