const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/userModel');

/* PUT /feed/posts */
router.put('/signup', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, {req}) => {
        return User.findOne({email: value})
            .then(userDoc => {
                if(userDoc){
                    return Promise.reject('Email Already Exists');
                }
            })
            .catch(err => {
                next(err)
            });
    })
    .normalizeEmail(),
    body('password')
    .trim()
    .isLength({min: 5}),
    body('name')
    .trim()
    .not()
    .isEmpty()
],authController.signUp);

/* PUT /auth/login */
router.post('/login' ,authController.login)

module.exports = router;