import express from 'express';
import protectRoute from '../middleware/protecRoute.js';
import {create,like,comment,deletepost,Likedposts, Allposts} from '../controllers/postcontroller.js'
const Router=express.Router();

Router.post('/create',protectRoute,create);
Router.post('/like/:id',protectRoute,like);
Router.get('/likedpost/:id',protectRoute,Likedposts);
Router.get('/getAll/',protectRoute,Allposts);
Router.post('/comment/:id',protectRoute,comment);
Router.delete('/:id',protectRoute,deletepost);


export default Router;