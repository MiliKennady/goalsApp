// here is where we define the schema 
// that is the fields for this particular resource
const mongoose = require('mongoose')

const goalSchema = mongoose.Schema(
    {
    user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'User' /* the name of the model whose id we are refering to*/
        },
    text: {
        type: String,
        required: [true, 'Please add a text Value']
    },
},
{
    timestamps: true
})

module.exports = mongoose.model('Goal', goalSchema)