const HttpError = require("../models/http-error");
const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    try{
        const token = req.headers.authorization.split(' ')[1] ; 
        if(!token){
            throw new HttpError('Authentication failed!', 401);
        }
        const decodeToken = jwt.verify(token, 'key_das_rounak_secret');
        req.userData = {userId: decodeToken.userId};
        console.log(req.userData);
        next();
    }catch(err)
    {
        const error = new HttpError('Authentication failed!', 401);
        return next(error);
    }
};