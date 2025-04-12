import express from 'express';
import {getnotification,deletenotification} from '../controllers/notificationcontroller.js'
import protectRoute from '../middleware/protecRoute.js'
const router=express.Router();
router.get('/',protectRoute,getnotification);
router.delete('/',protectRoute,deletenotification);

export default router