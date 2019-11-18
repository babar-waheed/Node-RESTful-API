const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    if(!req.get('Authorization')){
        throw new Error('Not authenticated');
    }
    const token = req.get('Authorization').split(' ')[1];
    let decondedToken;
    try{
        decondedToken = jwt.verify(token, 'PRIVATE_KEY');

    }catch(err) {
        throw err;
    }

    if(!decondedToken){
        throw new Error('Not authenticated');
    }

    req.userId = decondedToken.userId
    next();
}