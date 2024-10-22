const mongoose = require('mongoose')

const {Schema, model} = mongoose

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    emailId: String,
    password: String,
    age: String,
    gender: String
})

const User = model('User',userSchema);

module.exports = User

