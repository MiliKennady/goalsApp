const express = require('express')
const router = express.Router()
const {registerUser, loginUser, getMe} = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')


router.post('/', registerUser) // when we hit the route '/'(in this case it would be /api/users) we are going to call our controller function registerUser
router.post('/login', loginUser)
router.get('/me', protect, getMe)

module.exports = router