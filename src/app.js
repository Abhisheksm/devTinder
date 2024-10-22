const express = require('express')
require('./config/database')
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();

/*
express.json() is the middleware used to parse the JSON which is coming from req body to Javascript object.
*/
app.use(express.json())




app.post('/signup',async (req,res)=>{
    console.log('req', req.body)
    
    const user = new User(req.body) //It creates a new instance of user modal.
    try{
        let result = await user.save() // returns a promise and saves the newly created instance in the database.
        //res.send(result)
        res.send('User Signed up successfully.')
    }
    catch(err){
        res.status(500).send('Error occured while signing up:',err)
    }
})

//get user by email
app.get('/user', async(req, res)=>{
    const userEmail = req.body.emailId
    try{
        const users = await User.find({emailId: userEmail})
        if(!users.length) res.status(404).send('User not found!')
        else res.send(users)
    }
    catch(err){
        res.status(400).send('Something Went wrong')
    }
})

//Feed API: GET /feed get all the users from the database
app.get('/feed', async(req, res)=>{
    try{
        const users = await User.find({})
        if(!users.length) res.status(404).send('No User found!')
        else res.send(users)
    }
    catch(err){
        res.status(400).send('Something Went wrong')
    }
})

app.delete('/user', async(req, res)=>{
    const userId = req.body.userId
    try{
        const user = await User.findByIdAndDelete(userId)
        res.send('User Deleted Successfully!')
    }
    catch(err){
        res.status(400).send('Something Went wrong')
    }
})

app.patch('/user', async(req,res)=>{
    const userId = req.body.userId
    const data= req.body
    try{
        const user= await User.findByIdAndUpdate(userId, data)
        res.send('User Data updated successfully')
    }
    catch(err){
        res.status(400).send('Something Went wrong')
    }
})

connectDB().then(() => {
    console.log('Database connected successfully')
    app.listen(8000, () => {
        console.log('Server is successfully listening on port 8000')
    })

}).catch(err => {
    console.log('err while connecting database', err)
})

