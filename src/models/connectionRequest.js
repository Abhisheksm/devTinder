const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        toUserId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
             ref: 'User'
        },
        status:{
            type: String,
            required: true,
            enum:{
                values: ['ignored', 'interested', 'accepted', 'rejected'],
                message: `{VALUE} is incorrect type status`
            }
        }
    },
    {
      timestamps: true
    }
)

connectionRequestSchema.index({toUserId: 1, fromUserId:1})
/*
* pre is method on top of Schema in Mongoose, it runs every time before running the method we have mentioned.
* Here we have mentioned 'Save' method.
* Always use normla function, It does not work for Arrow functions
*/
connectionRequestSchema.pre('save', function(next){
    const connectionRequest = this

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId))
    {
        throw new Error('Invalid request, you cannot send connection request to yourself!')
    }
    next()
})

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports = ConnectionRequest;