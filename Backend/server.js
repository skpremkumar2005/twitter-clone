dotenv.config();
import express, { urlencoded } from 'express';
import dotenv from 'dotenv';  // Corrected import
import Authrouter from './routes/auth.js';
import ConnectDb from './db/db.connection.js'
import cookieParser from 'cookie-parser';
import UserRoute from './routes/userRoute.js';
import PostRoute from './routes/postRoute.js'
import NotificationRoute from './routes/notification.js';
import cloudinary from 'cloudinary'
import cors from 'cors';
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRETE_KEY,
})
const app = express();
app.use(urlencoded({
    extended:true
}))
app.use(express.json({
    limit:'5mb'
}))
app.use(cookieParser());
app.use(cors({
    origin: 'https://twitter-clone-blkf.onrender.com', // replace with your frontend URL
    credentials: true
}))
app.get('/',(req,res)=>{
    res.send('hi');
})
app.use('/api/auth/',Authrouter);
app.use('/user/',UserRoute);
app.use('/post',PostRoute)
app.use('/notification',NotificationRoute)



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`I am alive at ${PORT}`);
    ConnectDb();
});
