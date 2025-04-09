import express from 'express';
import protectRoute from '../middleware/protecRoute.js';
import  {getProfile,followOrunfollow,getsuggesion,updateProfile} from '../controllers/usercontroller.js'
const Router=express.Router();


Router.get('/getProfile/:username',protectRoute,getProfile)
Router.post('/follow/:id',protectRoute,followOrunfollow)
Router.get('/suggesion',protectRoute,getsuggesion);
Router.post('/updateprofile',protectRoute,updateProfile);



export default Router;