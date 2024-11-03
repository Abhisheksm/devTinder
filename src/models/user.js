const mongoose = require('mongoose')
const validator = require('validator');
const { Schema, model } = mongoose
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
    },
    lastName: { type: String },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email Id :'+value)
            }
        }
    },
    password: { type: String,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Please add Strong password :'+value) //MinLength:8, minUppercase:1, minLowercase:1, minNumber:1, symbol:1
            }
        }
     },
    age: { type: Number,
        min: 18,
     },
    gender: { type: String,
        validate(value){
            if(!['male', 'female', 'others'].includes(value.toLowerCase()))
            {
               throw new Error('Please enter valid gender!')
            }
        }
     },
    photoUrl: {
        type: String,
        default: 'https://manmohinihealthcare.com/wp-content/uploads/2019/07/dummy-user.jpg',
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('Invalid Photo Url :'+value)
            }
        }
    },
    about: {
        type: String,
        default: 'This is a default about of the user!'
    },
    skills: {
        type: [String]
    }
},{
    timestamps: true
})

userSchema.methods.getJwt = async function(){
    const user = this
   
    const token = await jwt.sign({_id: user._id},'Dev@Abhishek', {expiresIn:'1d'})

    return token

}

userSchema.methods.validatePassword = async function(userEnteredPassowrd){
    const user = this
    const hashedPassword= user.password
    const isPasswordValid = await bcrypt.compare(userEnteredPassowrd, hashedPassword)
    return isPasswordValid
}

const User = model('User', userSchema);

module.exports = User

