const mongoose = require('mongoose')



const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://Abhishek:Abhishek%401@abhishek.patpv.mongodb.net/devTinder')
}

module.exports = connectDB

