import Notification from "../models/notificationmodel.js"
import User from "../models/usermodels.js"

export const getnotification=async(req,res)=>{
try{
    const notification=await Notification.find({to:req.user._id}).populate({
        path:'from',
        select:'username image'
 } )
  await Notification.updateMany({to:req.user._id},{read:true})
  res.status(200).json(notification);

}
catch(e){
    res.status(400).json({error:"internal server error",e:e})
}
}
export const deletenotification=async(req,res)=>{
    try{
        await Notification.deleteMany({to:req.user._id})
      res.status(200).json({message:"notifications deleted"});
    
    }
    catch(e){
        res.status(400).json({error:"internal server error",e:e})
    }
    }