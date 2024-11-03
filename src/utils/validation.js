const validator = require('validator')

const validateSignUpData = (req)=>{
    const {firstName, lastName, emailId, password} = req.body

    if(!firstName || !lastName){
        throw new Error('Please enter valid Firstname or Lastname')
    }
    if(!validator.isEmail(emailId)){
        throw new Error('Please enter valid Email Id!')
    }
    if(!validator.isStrongPassword(password)){
        throw new Error('Please enter strong password!')
    }
}

module.exports={
    validateSignUpData
}