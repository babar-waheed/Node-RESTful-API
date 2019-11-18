const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bycrypt = require('bcryptjs');

/* PUT /auth/signup */
exports.signUp = (req, res, next) => {

    console.log('[User signup!]')
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        throw errors.array()
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    User.findOne({email: email})
        .then(user => {
            console.log("user [1] [] []", user)
            if(user) {
                 throw new Error('User already exists');

            }else{

                bycrypt.hash(password, 12)
                    .then(hashedPassword => {
                        console.log("hashedPassword [2] [] []", hashedPassword)
                        const user = new User({
                            email: email,
                            password: hashedPassword,
                            name: name 
                        })
                        return user.save();
                    })
                    .then(user => {
                        console.log("user [3] [] []",user);
                        res.status(201)
                            .json({
                                message: "User Created",
                                userId: user._id
                            })
                    })
                    .catch(err => {
                        console.log("[Err]:", err);
                        next(err)
                    })
            }
        })
        .catch(err => {
            console.log("[Err]:", err);
            next(err)
        })
}

/* POST /auth/login */
exports.login = (req, res, next) => {

    console.log("[LOGIN]");

    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;

    User.findOne({email: email})
        .then(user => {
            if(!user) {
                throw new Error("Email doesn't exits")
            }else{
                loadedUser = user;
                return bycrypt.compare(password, user.password);   
            }            
        })
        .then(isEqual => {
            if(!isEqual){
                throw new Error("Invalid email/password")
            }else{
                const token = jwt.sign({
                    email: loadedUser.email,
                    userId: loadedUser._id.toString()
                }, 'PRIVATE_KEY', {expiresIn: '1h'})
                
                res.status(200)
                    .json({
                        token: token,
                        userId: loadedUser._id.toString()
                    })
            }
        })
        .catch(err => {
            console.log(err);
            next(err)
        })
}

exports.getUserStatus = (req, res, next) => {

    User.findById(req.userId)
      .then(user => {
        if (!user) {
            throw new Error('User not found')
        }
        res.status(200).json({ status: user.status });
      })
      .catch(err => {
        next(err);
      });
  };
  
  exports.updateUserStatus = (req, res, next) => {
    const newStatus = req.body.status;

    console.log("newStatus", newStatus);
    
    User.findById(req.userId)
      .then(user => {
        if (!user) {
            throw new Error('User not found')
        }
        user.status = newStatus;
        return user.save();
      })
      .then(result => {
        res.status(200).json({ message: 'User updated.' });
      })
      .catch(err => {
        next(err); 
      });
  };