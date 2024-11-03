const express = require('express')
require('./config/database')
const connectDB = require('./config/database');
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation')
const app = express();
const bcrypt = require('bcrypt')
const validator = require('validator')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const {userAuth} = require('./middlewares/middleware')
/*
express.json() is the middleware used to parse the JSON which is coming from req body to Javascript object.
*/
app.use(express.json())
app.use(cookieParser())



app.post('/signup', async (req, res) => {
    console.log('req', req.body)

    try {
        //Validate data
        validateSignUpData(req)
        const { firstName, lastName, emailId, password } = req.body
        //Encrypt password
        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashPassword
        })  //It creates a new instance of user modal.
        let result = await user.save() // returns a promise and saves the newly created instance in the database.
        //res.send(result)
        res.send('User Signed up successfully.')
    }
    catch (err) {
        res.status(400).send('Error occured while signing up : ' + err)
    }
})

app.post('/login', async (req, res) => {
    const { emailId, password } = req.body
    try {
        if (!validator.isEmail(emailId)) throw new Error('Please enter valid Email Id')

        const userData = await User.findOne({ emailId: emailId })

        if (!userData) throw new Error('Invalid Credentials!')

        const isPasswordMatched = await userData.validatePassword(password)

        if (!isPasswordMatched) {
            throw new Error('Invalid Credentials!')
        }
        else {
           const token = await userData.getJwt()

           res.cookie("token",token)
           res.send('User Logged in successfully!')
        }
    }
    catch (err) {
        res.status(400).send('Error : ' + err)
    }
})

app.get('/profile', userAuth, async (req, res)=>{
    try{
            const user = req.user
            res.send(user)
    }
    catch(err){
        res.status(400).send('Error : ' + err.message)
    }
})

app.post('/sendConnectionRequest', userAuth,  async(req, res)=>{
    const user = req.user
    res.send('Connection request sent by '+ user.firstName)
})

connectDB().then(() => {
    console.log('Database connected successfully')
    app.listen(8000, () => {
        console.log('Server is successfully listening on port 8000')
    })

}).catch(err => {
    console.log('err while connecting database', err)
})

