const express = require('express')
const {userAuth, adminAuth} = require('./middlewares/middleware')

const app = express();

app.listen(8000)

// app.use('/hello', (req,res)=>{
//     res.send('heelo router')
// })



app.get('/user/login',(req,res)=>{
    res.send('User logged in')
})

app.use('/user',userAuth,(req,res)=>{
    res.send('User data has been sent')
})

app.use('/admin',adminAuth)

app.get('/admin/getdata',(req,res)=>{
    res.send('Admin data received')
})

app.get('/admin/updatedata',(req,res)=>{
    res.send('Admin data has been updated')
})

