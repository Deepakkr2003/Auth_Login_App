const express=require('express');
const app=express();
const bodyParser=require('body-parser')
const cors=require('cors');
const AuthRouter = require('./Routes/AuthRouter')
const ProductRouter = require('./Routes/ProductRouter')

require('dotenv').config();
const connect=require('./Models/db')

const users=require('./Models/User')

const PORT = process.env.PORT || 8080;

app.get('/ping',(req,res)=>{
    res.send('PONG')
})

app.use(bodyParser.json());
app.use(cors());
app.use('/auth',AuthRouter)
app.use('/products',ProductRouter)


app.listen(PORT,async()=>{
    console.log(`server is running on ${PORT}`);
    await connect();
    console.log('Mongo db connected');
    
    
})