const userAuth = (req,res,next) =>{
    console.log('Checking for userAuth')
    const token = 'abc'
    const isAuthorized = token === 'abc'
    if(!isAuthorized)
    {
        res.status(401).send('User is not Authorised')    }
        else{
            next()
        }
}

const adminAuth = (req,res,next)=>{
    console.log('Checking for adminAuth')
    const token = 'abc'
    const isAuthorized = token === 'abc'
    if(!isAuthorized)
    {
        res.status(401).send('Admin is not Authorised')    }
        else{
            next()
        }
}

module.exports = {
    userAuth,
    adminAuth
}