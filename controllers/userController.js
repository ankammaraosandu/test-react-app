const JWT = require('jsonwebtoken')
const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel =require('../models/userModel')
var {expressjwt:jwt}=require('express-jwt')
const requireSignIn = jwt({
    secret:process.env.JWT_SECRET,algorithms:["HS256"],
})
const registerController= async(req,res)=>{
    try {
        const {name,email,password} =req.body
        if(!name){
            return res.status(400).send({
                success:false,
                message:"name req"
            })
        }
        if(!email){
            return res.status(400).send({
                success:false,
                message:"email req"
            })
        }
        if(!password||password.length<6){
            return res.status(400).send({
                success:false,
                message:"paass is short"
            })
        }
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(500).send({
                success:false,
                message:"user already reg"
            })
        }
        const hashedPassword =await hashPassword(password)
        const user =await userModel({name,email,password:hashedPassword}).save();
       return  res.status(201).send({
            success:true,
            message:"reg sucess login"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"error",
            error,

        })
    }
};
//login
const loginController = async(req,res) =>{
    try {
        const {email,password}=req.body
        if(!email||!password){
            return res.status(500).send({
                success:false,
                message:"empty email or password"
            })
        }

        const user = await userModel.findOne({email})
        if(!user){
            return res.status(500).send({
              success: false,
              message:"not found"  
            })
        }
        const match = await comparePassword(password,user.password)
        if(!match){
            return res.status(500).send({
                success:false,
                message:"invalid "
            })
        }
        //Tolken
        const token = await JWT.sign({_id : user._id},process.env.JWT_SECRET,{
            expiresIn:'10d'
        })
        user.password = undefined;
        res.status(200).send({
            success:true,
            message:"login success",
            token,
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"error login",
            error
        })
    }
};
const updateUserController = async (req,res)  =>{
    try {
        const {name,password,email}=req.body
        const user = await userModel.findOne({email})
        if(password&&password.length<6){
            return res.status(400).send({
                success:false,
                message:'password short'
            })
        }
        const hashedPassword = password?await hashPassword(password) :undefined
        const updatedUser = await userModel.findOneAndUpdate({email},{
            name : name || user.name,
            password: hashedPassword || user.password
        },{new:true});
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message:"updated",
            updatedUser,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error',
            error
        })
    }
}
module.exports = {registerController,loginController,updateUserController,requireSignIn};