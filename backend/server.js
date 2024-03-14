//bring in express i.e our backend web frame work
const express = require('express')

// .env so we can have environment variables
const dotenv = require('dotenv').config()

//bring in the errorHandler middleware
const {errorHandler} = require('../backend/middleware/errorMiddleware')

// port where we want our server to run on
const port = process.env.PORT || 5000

// to connect to mongoDB
const connectDB = require('./config/db')

// call the function to connect to database
connectDB()


// initialise express
const app = express()

// setup needed in order to access the body of the request
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// everytime /api/goals is hit, it will look into the specified file
app.use('/api/goals', require('./routes/goalRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

// this will overrride the express default error handling
app.use(errorHandler)

// listen to the port number
app.listen(port, () => console.log(`Server started on port ${port}`))