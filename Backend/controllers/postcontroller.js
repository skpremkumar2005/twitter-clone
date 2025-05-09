import Notification from "../models/notificationmodel.js";
import post from "../models/post.js";
import User from "../models/usermodels.js";
import cloudinary from 'cloudinary'

export const create=async(req,res)=>{
    try{
      const {text}=req.body;
      let {img}=req.body;
      const user_Id=req.user.id.toString();
      const user =await User.findOne({_id:user_Id})
      if(!user)return res.status(404).json({error:"user not found"});
      if(!img&&!text)return res.status(404).json({error:"must need img or text"});
      if(img){
        const uploadresponse=await cloudinary.uploader.upload(img);
        img=uploadresponse.secure_url
      }
      const newpost=new post({
        user:user_Id,
        text,
        img
      })
    //   console.log(2);
   

      await newpost.save();
      res.status(200).json(newpost);

    }
    catch(e){
        res.status(500).json({error:"internal server error",e:e});
        console.log(e);
    }

}
export const like=async(req,res)=>{
    try{
      const {id}=req.params;
      const userid=req.user._id.toString();
      const Post=await post.findById(id);
      if(!Post)return res.status(400).json({error:"post not found"});
      const find=Post.likes.includes(userid);
      if(find){
        await post.findByIdAndUpdate({_id:id},{$pull:{likes:userid}})
        await User.findByIdAndUpdate({_id:userid},{$pull:{Likedposts:id}})

       res.status(200).json({message:"unliked"});
      }
      else{
        await post.findByIdAndUpdate({_id:id},{$push:{likes:userid}})
        const notification = new Notification({
          type:"like",
          from:userid,
          to:Post.user
         })
         await notification.save();
         await User.findByIdAndUpdate({_id:userid},{$push:{Likedposts:id}})
       res.status(200).json({message:"liked"});
      }
      

    }
    catch(e){
        res.status(500).json({error:"internal server error",e:e});
    }

}
export const comment=async(req,res)=>{
    try{
      const {id}=req.params;
      // console.log(id)
      const userId=req.user._id.toString();
      const {text}=req.body
      // console.log(text)
      if(!text)return res.status(400).json({error:"text not found"});
      const Post=await post.findById(id);
      if(!Post)return res.status(400).json({error:"post not found"});
      const comment={
        text:text,
        user:userId,
      }
      Post.Comment.push(comment);
      await Post.save();
      res.status(200).json({message:"sent"});

    }
    catch(e){
        res.status(500).json({error:"internal server error",e:e});
    }

}
export const Likedposts=async(req,res)=>{
  try{
    const {id}=req.params;
    const userdetails=await User.findById(id);
    if(!userdetails)return res.status(404).json({error:"user not found"})
    // const postthatliked=[{}];
    // if(userdetails.Likedposts.length===0)return res.status(200).json({massage:"no post found"});
    // for(let i=0;i<userdetails.Likedposts.length;i++){
    //   postthatliked.push(await post.findById(userdetails.Likedposts[i]._id));
    // }
    
    // res.status(200).json(postthatliked);
    const liked= await post.find({_id:{$in:userdetails.Likedposts}}).populate({
      path:'user',
      select:'-password'
    }).populate({
      path:'Comment.user',
      select:'-password'
    })
               
    res.status(200).json(liked)
  }
  catch(e){
      res.status(500).json({error:"internal server error",e:e});
  }

}
export const Allposts=async(req,res)=>{
  try{
    const allpost=await post.find().sort({createdAt:-1}).populate({
      path:"user",
      select:"-password"

    }).populate({
      path:"Comment.user",
      select:'-password'
    })
    if(allpost.length===0)return res.status(200).json([])
    res.status(200).json(allpost);

  }
  catch(e){
      res.status(500).json({error:"internal server error",e:e});
  }

}

export const deletepost = async (req, res) => {
  try {
    const userpost = await post.findById(req.params.id);
    if (!userpost) return res.status(404).json({ error: "Post not found" });

    if (userpost.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You don't have permission to delete this post." });
    }

    // Delete image from cloudinary
    if (userpost.img) {
      const publicId = userpost.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // Delete post from DB
    await post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (e) {
    console.error("Error deleting post:", e);
    res.status(500).json({ error: "Internal server error", details: e.message });
  }
};
export const getfollowingpost=async(req,res)=>{
  try{
    const userdetails= await User.findById(req.user._id);
    if(!userdetails)return res.status(400).json({error:"user not found"})    
    if(userdetails.followings.length===0)return res.status(200).json([]) 
    const followpost=await post.find({user:{$in:userdetails.followings}}).sort({createdAt:-1}).populate({
      path:"user",
      select:"-password"

    }).populate({
      path:"Comment.user",
      select:'-password'
    })

    if(followpost.length===0)return res.status(200).json([])
    res.status(200).json(followpost);

  }
  catch(e){
      res.status(500).json({error:"internal server error",e:e});
  }

}
export const Userposts=async(req,res)=>{
  try{
    const {username}= req.params;
    const userdetails=await User.findOne({username:username})
    if(!userdetails)return res.status(400).json({error:"user not found"})    
    const followpost=await post.find({user:userdetails._id}).sort({createdAt:-1}).populate({
      path:"user",
      select:"-password"

    }).populate({
      path:"Comment.user",
      select:'-password'
    })

    if(followpost.length===0)return res.status(200).json([])
    res.status(200).json(followpost);

  }
  catch(e){
      res.status(500).json({error:"internal server error",e:e});
  }

}