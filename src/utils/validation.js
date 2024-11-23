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

const validateEditProfileData =(req)=>{

    const allowedEditFields = ['gender', 'photoUrl', 'about', 'skills', 'firstName', 'lastName']

    const isAllowed = Object.keys(req?.body).every(field => allowedEditFields.includes(field))

    return isAllowed

}

module.exports={
    validateSignUpData,
    validateEditProfileData,
}