const express=require("express");
const mongoose=require("mongoose");
require('dotenv').config();
const studentModel=require('./studentModel');
var validator = require("email-validator");

const app=express();

app.use(express.json());

const db_link=`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.zsjyksv.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(db_link)
.then(function(db){
    console.log("Database Connected");
})
.catch(function(err){
    console.log(err);
})

//Create API
app.post("/storeData",async(req,res)=>{
const {stuId,name,email,phone}=req.body;

if( !stuId || !name || !email || !phone){
    return res.json({
        message: "All credentials are required"
    })
}

if(phone.length!=10){
    return res.json({
        message: "Invalid Phone Number"
    })
}

if(validator.validate(email)==false){
    return res.json({
        message: "Invalid Email Address"
    })
}

let alreadyRegistered=await studentModel.find({stuId:stuId});

if(alreadyRegistered.length!=0){
    return res.json({
        message:"Student data already stored"
    })
}

let newData={
    stuId:stuId,
    name:name,
    email:email,
    phone:phone
}

let data=await studentModel.create(newData);

return res.json({
    message:"Data Saved",
    Data:data
})


})

//Read API
app.get('/readData/:stuId',async(req,res)=>{
    const stuId=req.params.stuId;

    let data=await studentModel.find({stuId:stuId});

    if(data.length!=0){
        res.json({
            message:"Data Found",
            data:data
        })
    }else{
        res.json({
            message:"No data found"
        })
    }    
})


//Delete API
app.get('/deleteData/:stuId',async(req,res)=>{
    const stuId=req.params.stuId;

    let data=await studentModel.findOneAndDelete({stuId:stuId});

    if(data.length!=0){
        res.json({
            message:"Data Deleted",
            data:data
        })
    }else{
        res.json({
            message:"No data found"
        })
    }    
})


//Update API
app.post("/updateData",async(req,res)=>{
    const {stuId,name,email,phone}=req.body;
    
    if( !stuId || !name || !email || !phone){
        return res.json({
            message: "All credentials are required"
        })
    }
    
    if(phone.length!=10){
        return res.json({
            message: "Invalid Phone Number"
        })
    }
    
    if(validator.validate(email)==false){
        return res.json({
            message: "Invalid Email Address"
        })
    }

    let newData={
        stuId:stuId,
        name:name,
        email:email,
        phone:phone
    }
    
    let update=await studentModel.findOneAndUpdate({stuId:stuId},newData);

    
    if(update){
        return res.json({
            message:"Data Updated"
        })
    }
    
    
    return res.json({
        message:"No data found",
    })
    
    
    })






const PORT=4000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})