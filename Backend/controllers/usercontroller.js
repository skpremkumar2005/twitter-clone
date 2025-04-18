import express from 'express'
import User from '../models/usermodels.js';
import Notification from '../models/notificationmodel.js';
import bcrypt from 'bcryptjs';
import cloudinary from 'cloudinary';
export const getProfile=async(req,res)=>{
    const {username}=req.params;
    
    try{
        const user= await User.findOne({username:username}).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json(user);
    }
    catch(e){
        res.status(404).json({message:e.message})
        console.log("hi");
    }
}
export const followOrunfollow=async(req,res)=>{
    const {id}=req.params;
    try{
    const modifyuserId= await User.findOne({_id:id});
    const currentuserId=await User.findOne({_id:req.user._id});
    if(currentuserId._id===id)return res.status(500).json({error:"you can't follow your self da .."});
    if(!modifyuserId||!currentuserId){
        return res.status(500).json({error:"Invalid user or follower not exist"});
    }
    const isfollowing=await currentuserId.followings.includes(id);
    if(isfollowing){
       await User.findByIdAndUpdate({_id:currentuserId._id},{$pull:{followings:id}})
       await User.findByIdAndUpdate({_id:id},{$pull:{followers:req.user._id}})
       res.status(200).json({message:"successfully unfollowed"});

    }
    else{
       await User.findByIdAndUpdate({_id:currentuserId._id},{$push:{followings:id}})
       await User.findByIdAndUpdate({_id:id},{$push:{followers:req.user._id}})
       const notification = new Notification({
        type:"follow",
        from:currentuserId._id,
        to:modifyuserId._id
       })
       await notification.save();
       res.status(200).json({message:"successfully followed"});

    }
}
catch(e){
    res.status(500).json({error:"Invalid user of follower"});
}

}
export const getsuggesion=async(req,res)=>{
    try{
        const id=req.user._id;
        const userfollowers= await User.findOne({_id:id}).select("followings");
        const randomuser=await User.aggregate([
         {   $match:{_id:  {$ne:id}}
        },{$sample:{size:10}
        }])

        const filteredid=randomuser.filter((user)=>!userfollowers.followings.includes(user._id));
        const suggesteduser=filteredid.slice(0,4);
        suggesteduser.forEach((user)=>user.password=null);
        res.status(200).json(suggesteduser);

    }
    catch(e){
        res.status(500).json({error:"internal server error",e:e});
    }
}
export const updateProfile = async (req, res) => {
	try {
		let user = await User.findById(req.user._id);
		if (!user) return res.status(400).json({ message: "User not found" });

		let {
			username,
			fullname,
			email,
			currentpassword,
			newpassword,
			bio,
			link,
			coverImage,
			image,
		} = req.body;

		if ((currentpassword && !newpassword) || (!currentpassword && newpassword)) {
			return res.status(400).json({ error: "Both current and new password are required" });
		}

		if (currentpassword && newpassword) {
			if (newpassword.length < 6) {
				return res.status(400).json({ error: "Password must be at least 6 characters" });
			}
			const isMatch = await bcrypt.compare(currentpassword, user.password);
			if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(newpassword, salt);
		}

		if (coverImage) {
			if (user.coverImage) {
				await cloudinary.uploader.destroy(user.coverImage.split('/').pop().split('.')[0]);
			}
			const response = await cloudinary.uploader.upload(coverImage);
			coverImage = response.secure_url;
		}

		if (image) {
			if (user.image) {
				await cloudinary.uploader.destroy(user.image.split('/').pop().split('.')[0]);
			}
			const response = await cloudinary.uploader.upload(image);
			image = response.secure_url;
		}
        

		user.username = username || user.username;
		user.email = email || user.email;
		user.fullname = fullname || user.fullname;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.image = image || user.image;
		user.coverImage = coverImage || user.coverImage;

		await user.save();
		res.status(200).json({ message: "Updated successfully", userData: user });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "Internal server error", errorDetails: e.message });
	}
};
