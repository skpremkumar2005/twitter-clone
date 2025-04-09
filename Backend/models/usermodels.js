import mongoose from "mongoose";
const Userschema=mongoose.Schema({
username:{ type:String,
           required:true,
           unique:true,
} ,
fullname:{
    type:String,
    required:true,
},
email:{
   type:String,
   required:true,
   unique:true,
},
password:{
    type:String,
    required:true,
    minimumlen:6
},
followers:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
    },
],
followings:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
    },
],
bio:{
    type:String,
    default:""
},
link:{
    type:String,
    default:"",
},
image:{
    type:String,
    default:'',
},
coverImage:{
    type:String,
    default:'',
},
Likedposts:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Posts',
        default:[]
    }
]



},{timestamps:true})

const User=mongoose.model("User",Userschema);
export default User;