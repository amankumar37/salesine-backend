const express = require('express');
const cors = require('cors');
const bodyParser= require('body-parser')
const app = express();
const mongoose = require('mongoose');
const User = require('./model/user')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();



app.use(cors()); 
app.use(bodyParser.json());
 

app.post('/update',async(req,res)=>{
     const decoded = jwt.verify(req.body.token,'secret');
     console.log(decoded);

     try{
         const email=decoded.email;
         const user = await User.updateOne({email:email},{$set:{quote:req.body.temp}});

         return res.json({status:'ok', quote:req.body.temp});
     }catch{
            console.log("Error in updating quote");
            res.json({status:'error',error:'invalid token'})
     }
})

app.post('/populate',async(req,res)=>{
    const decoded = jwt.verify(req.body.token,'secret');
    try{
        const email=decoded.email;
        const user = await User.findOne({email:email});

        return res.json({status:'ok', quote:user.name});
    }catch{
           console.log("Error in populating quote");
           res.json({status:'error',error:'invalid token'})
    }
})


app.post('/login',  async(req,res)=>{
      
           const user = await User.findOne({email:req.body.email,password:req.body.password});
           
           if(user){
            const token=   jwt.sign({
                   name:user.name,
                   email:user.email
               },'secret');
               return res.json({status:'ok',user:token});
           }else{
            return res.json({status:'error',user:false})
           }
      
}) 



app.post('/register',async (req,res)=>{
    console.log(req.body);
    try{
        const newUser =  await User.create({
            name: req.body.name,
            email:req.body.email,
           password: req.body.password
         })
         newUser.save();
         res.json({status:'ok'});
       }catch{
        res.json({status:'error',error:'Duplicate email'})
       }
})


const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    
  })
  .catch((error) => console.log(`${error} did not connect`));