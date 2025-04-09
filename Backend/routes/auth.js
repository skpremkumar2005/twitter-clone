import express from 'express';
import {signin,logout,signup,getMe} from '../controllers/authcontroller.js'
import protectRoute from '../middleware/protecRoute.js'
const router=express.Router();

router.post('/signin',signin)
router.post('/logout',logout)
router.post('/signup',signup)
router.get('/me',protectRoute,getMe)




export default router;