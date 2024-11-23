const express = require('express')

const router = express.Router()
const {userAuth} = require('../middlewares/middleware')
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')


router.post('/request/send/:status/:toUserId', userAuth,  async(req, res)=>{
   try{
      const fromUserId = req.user._id
      const toUserId = req.params.toUserId
      const status = req.params.status

      const allowedStatus = ['ignored', 'interested']

      if(!allowedStatus.includes(status)){
        return res.status(400).json({message:'Invalid status type :'+status})
      }

      const istoUserIdExists = await User.findById(toUserId)

      if(!istoUserIdExists){
        return res.status(400).send({message: 'Invalid request.'})
      }

    //   if(fromUserId == toUserId){
    //     return res.status(400).json({message: 'Invalid request, you cannot send connection request to yourself!'})
    //   }

     

      const checkForExisitngConnectionRequest = await ConnectionRequest.findOne({
        $or: [
            {fromUserId, toUserId},
            {fromUserId: toUserId, toUserId: fromUserId}
        ]
      })

      if(checkForExisitngConnectionRequest){
        return res.status(400).send({message: 'Connection request already exist.'})
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
      })

      const data = await connectionRequest.save()

      let messageAsPerStatus =''
      if(status === 'interested')
      {
        messageAsPerStatus = 'Connection Request sent successfully.'
      }
      else if(status === 'ignored')
      {
        messageAsPerStatus = 'Connection Request has been ignored.'
      }
      res.json({
        message: messageAsPerStatus,
        data
      })
   }
   catch(err)
   {
    res.status(400).send("Error :"+ err.message)
   }
})

router.post('/request/review/:status/:requestId', userAuth, async (req, res)=>{
    try{

        const loggedInUser = req.user
        const {status, requestId} = req.params

        const allowedStatus = ['accepted', 'rejected']
        if(!allowedStatus.includes(status))
        {
            return res.status(400).json({
                message:'Invalid status type :'+status
            })
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        })

        if(!connectionRequest){
            return res.status(404).send({message: 'Connection request not found.'})
        }

        connectionRequest.status = status
        const data=  await connectionRequest.save()

        res.json({
            message: 'Connection request '+status,
            data: data
        })

    }
    catch(err){
        res.status(400).send("Error :"+ err.message) 
    }
})

module.exports = router