import mongoose from "mongoose";

const postschema= mongoose.Schema({
 user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
 },

 text: {
   type: String,
},
img:{
   type:String,
   
},
 likes:[
   {type:mongoose.Schema.Types.ObjectId,
      ref:'User',
   }
 ],
 Comment:[{
   text:{
      type:String,
      required:true

   },
   user:{type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true,
   }
}
 ]





},	{ timestamps: true }
)
const post=mongoose.model("Posts",postschema);
export default post;