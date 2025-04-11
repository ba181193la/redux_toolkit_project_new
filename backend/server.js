const express =require('express')
const app=express()
const db=require('./db/db')
const bodyParser=require('body-parser')
const userAuh=require('./routes/auth')
db()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}))

// parse application/json
app.use(bodyParser.json())

app.use('/user',userAuh);

app.listen('5000',()=>{
    console.log("server is running 5000");
    
})