// get express into the file
const express = require('express')

const router = express.Router()

// get in your controller functions
const {getGoals, setGoal, updateGoal,  deleteGoal} = require('../controllers/goalController')

const {protect} = require('../middleware/authMiddleware')

router.route('/').get(protect, getGoals).post(protect, setGoal)
router.route('/:id').put(protect,updateGoal).delete(protect,deleteGoal)

// simplified version of below code is above
// we have simplified based on same routes using the different crud ops
// // get all goals
// router.get('/', getGoals)

// // post to create a goal
// router.post('/', setGoal)

// // update a goal (always when updating we need to specify the id)
// router.put('/:id', updateGoal)

// // delete a goal (specify id when deleting)
// router.delete('/:id', deleteGoal)



module.exports = router