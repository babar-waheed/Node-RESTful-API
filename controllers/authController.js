const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const bycrypt = require('bcryptjs');

/* PUT /feed/posts */
exports.signUp = (req, res, next) => {

    console.log('[User signup!]')
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        throw errors.array()
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    bycrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                name: name 
            })

            return user.save();
        })
        .then(user => {
            res.status(201)
                .json({
                    message: "User Created",
                    userId: user._id
                })
        })
        .catch(err => {
            console.log("Inside Catch", err);
            next(err)
        })



}


/* PUT /feed/posts */
exports.p = (req, res, next) => {
    
}

/* PUT /feed/posts */
exports.p = (req, res, next) => {
    
}