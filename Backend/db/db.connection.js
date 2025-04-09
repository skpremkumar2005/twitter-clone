import mongoose from "mongoose";
export default  async()=>{
    try{
       await mongoose.connect(process.env.MongoDb);
       console.log("DB connected");
    }
    catch(e){
       console.log(`error in connecting db : ${e}`);
       process.exit(1);
    }
}