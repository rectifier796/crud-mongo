const mongoose=require('mongoose');

const studentSchema=mongoose.Schema({
    stuId:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    }
})

const studentModel=mongoose.model('studentModel',studentSchema);
module.exports=studentModel;