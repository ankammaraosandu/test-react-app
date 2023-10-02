const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required : [true, 'add name'],
        trim:true
    },
    email:{
        type:String,
        required : [true, 'add email'],
        unique:true,
        trim:true
    },password:{
        type:String,
        required : [true,'add password'],
        min:6,
        max:64,
    },
    role:
    {
        type:String,
        default:"user",
    }},
    {timestamps:true}
);
module.exports =mongoose.model("User",userSchema);