//using the package called express async handlern - nom i express-sync-handler
const asyncHandler = require('express-async-handler')

const Goal = require('../models/goalModel')
const User = require('../models/userModel')

// @desc Get Goal
// @route GET /api/goals
// @access Private
const getGoals = asyncHandler(async (req, res) => {

    // get only the specific users goal
    // the req.user will have value assigned by the protect middleware
    const goals = await Goal.find({ user: req.user.id})

    res.status(200).json(goals)
})

// @desc Set Goal
// @route POST /api/goals
// @access Private
const setGoal = asyncHandler(async (req,res)=>{
    console.log(req.body.text)
    // if no data sent (here text is the key of our object being sent from postman)
    if(!req.body.text){
        // res.status(400).json({message: 'Please add a text field'}) 
        res.status(400)
        // error handelling in json
        throw new Error('Please add a text field')
        
     }

     // req.user is provided by the protect middleware
     const goal = await Goal.create({
            text: req.body.text,
            user: req.user.id
     })
    res.status(200).json(goal)
})

// @desc Update Goal
// @route PUT /api/goals
// @access Private
const updateGoal = asyncHandler( async (req,res)=>{

    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }

    // getting the user that is currently logged in
    const user = await User.findById(req.user.id)

    // if user doesnt exist
    if(!user){
        // 401 for not authorized
        res.status(401)
        throw new Error('User not found')
    }

    //check if the user id of the goal matches the logged in user id
    // or make sure the looged in user matches the goal user
    if(goal.user.toString() !== user.id){
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body,{
        new: true, // will create a new resource if it doesnt exist
    })

    res.status(200).json(updatedGoal)
})

// @desc Delete Goal
// @route DELETE /api/goals
// @access Private
const deleteGoal =  asyncHandler( async (req,res)=>{

    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error('Goal not Found')
    }

     // getting the user that is currently logged in
     const user = await User.findById(req.user.id)

     // if user doesnt exist
     if(!user){
         // 401 for not authorized
         res.status(401)
         throw new Error('User not found')
     }
 
     //check if the user id of the goal matches the logged in user id
     // or make sure the looged in user matches the goal user
     if(goal.user.toString() !== user.id){
         res.status(401)
         throw new Error('User not authorized')
     }

    await Goal.deleteOne({ _id: req.params.id})

    res.status(200).json({message: `Delete Goal with id ${req.params.id}`})
})

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal
}