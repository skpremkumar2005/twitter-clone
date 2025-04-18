import express from 'express';
import User from '../models/usermodels.js'
import bcrypt from 'bcryptjs'
import gettoken from '../utils/token.js'
export const signin= async(req,res)=>{
   try{
       const {username,email,password}=req.body;
    // console.log("hi");
       if(email.length>0){
            const existingdetails= await User.findOne({email});
            if(existingdetails){
                const pass= await bcrypt.compare(password,existingdetails.password);
                if(pass){
                   gettoken(existingdetails._id,res);
                  } 
                else {
                   return res.status(400).json({"error":"password not match"});
                  }
        
       } 
       else {
        return res.status(400).json({"error":"invalid mail"});
         }
         res.status(200).json("successfully login");
        }
       else {
           const existingdetails= await User.findOne({username});
            if(existingdetails){
                const pass= await bcrypt.compare(password,existingdetails.password);
                if(pass){
                   gettoken(existingdetails._id,res);
                 } 
                 else {
                   return res.status(400).json({"error":"password not match"});
                 }
        
              } 
            else {
              return res.status(400).json({"error":"invalid username"});
              }
        res.status(200).json("successfully login");
            }
    

    }
    catch(e){
     res.status(400).json(`error:`);
    }
}
export const signup=async(req,res)=>{
    try{
   const {username,fullname,email,password}=req.body;
  //  console.log(req.body);
   if(!fullname||!email||!password||!username)return res.status(400).json({error:"credential missing"});
     const existingemail= await User.findOne({email})
     const existinguser=await User.findOne({username});
     if(existingemail||existinguser){
      return   res.status(400).json(`error : email or username Already exist`);
     }
     if(password.length<6) return res.status(400).json("mininum length 6");

     const salt=await bcrypt.genSalt(10);
     const hashpassword=await bcrypt.hash(password,salt);
     const user=new User({
        username,
        fullname,
        email,
        password:hashpassword

     })
     if(user){
        // console.log("hi");
        gettoken(user._id,res);
        await user.save();
        res.status(200).json({message:'successfully created'})
     }else {
        res.status(400).json({error:'invalid user data'})
     }

    }
    catch(e){
         res.status(500).json({error:"internal server error"})
        console.log(`error in sign up :${e}`);
    }
}
export const logout=(req,res)=>{
    try{
      res.cookie("jwt","",{maxAge:0})
      res.status(200).json("logout sucessfully");

    }
    catch(e){
        console.log(`error in logout :${e}`);
        res.status(500).json("internal server error");
    }
    // console.log("f");
}
export const getMe=async(req,res)=>{
    try{
     const user =await User.findOne({_id:req.user._id}).select("-password");
     res.status(200).json({user});

    }
    catch(e){
        console.log(`error in logout :${e}`);
        res.status(500).json("internal server error");
    }
    // console.log("f");
}

