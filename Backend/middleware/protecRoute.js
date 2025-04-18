// import { json } from 'express';
import jwt from 'jsonwebtoken'
import User from '../models/usermodels.js';

const protectRoute=async(req,res,next)=>{
   try{
    const token =req.cookies.jwt;
    // console.log(token);
    if(!token){
        return res.status(401).json({success:false,error:"Please login to access this route"});
    }
        const decode = jwt.verify(token,process.env.jwt);
        if(!decode){
            return res.status(401).json({error:"Invalid token"});
        }
        const user = await User.findOne({_id:decode.userId}).select("-password");
        if(!user){
            return res.status(401).json({error:"invalid token user not found"});
        }
        req.user=user;
    
        next();
 
   }
   catch(e){
    res.status(401).json({message:"Not authorized",error:e})
    
   }
}

export default protectRoute;  