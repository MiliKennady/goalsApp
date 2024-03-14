const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel') // bring in our User Model

// Note: wrap your functions in asyncHandler to handle async calls

// @desc Register new User
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {

    //get the details sent in the request body
    const { name, email, password } = req.body

    if(!name || !email || !password){
        // 400 since this would be a bad request
        res.status(400)
        throw new Error('Please add all field')

    }

    // check if user already exists
    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400)

        throw new Error('User already Exists')
    }

    // Hash password
    // we need to generate a salt to hash the password
    // 10 represents the no of rounds here which is also the default
    const salt = await bcrypt.genSalt(10)
    // this will give us the hashed password
    const hashedPassword = await bcrypt.hash(password, salt)

    //Create the user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    // if user was created successfully
    if(user){
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        })
    } else{
        res.status(400)
        throw new Error('Invalid User Data')
    }

   
})

// @desc Authenticate User (Login)
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {

    const {email, password} = req.body

    // first find the user by the email
    const user = await User. findOne({email})

    // after getting the user then match the password
    // password in the db is hashed and the password sent from login is not hashed so we need to call a decrypt method

    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        })
    } else{
        res.status(400)
        throw new Error('Invalid Credentials')
    }
    
})

// @desc Get User Data
// @route GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
    // the req.user was set in the middleware after token verified
    const { _id, name, email} = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        name: name,
        email: email
    })
})

// @desc Generate a Token i.e JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe
}