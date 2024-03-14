// a middleware is a function that runs during a request response cycle
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler( async (req, res, next) => {

    let token
    // the token is present in the request header ( the http header) within authorization
    // when token is sent via authorization headers it is formatted like "Bearer Tkhdkfkcg57454"
    // also need to check if the token starts with the "Bearer" string
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{

            // get token from the request header authorization
            // split function does this token = ["Bearer", "Tkhdkfkcg57454"], so indexing it like [1]
            token = req.headers.authorization.split(' ')[1];
           
            // verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get user id from the token payload which we sent in userController while logging in using generateToken function
            // also assigning this to request so we can access it
            req.user = await User.findById(decoded.id).select('-password')  // select the user without the password field
            

            // end of this middleware so we need to call the next peice of middleware 
            next();

        } catch (error){

            console.log(error)
            // 401 means not authorized
            res.status(401)
            throw new Error('Not Authorized!')

        }

        
    }
       
    if(!token){
        res.status(401)
        throw new Error('Not Authorized, No Token!')
    }
})

module.exports = {protect}

// token are present in the authorization header like this:
// Bearer Tkhdkfkcg57454