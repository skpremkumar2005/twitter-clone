import express from 'express';
import protectRoute from '../middleware/protecRoute.js';
import {create,like,comment,deletepost,Likedposts, Allposts,getfollowingpost,Userposts} from '../controllers/postcontroller.js'
const Router=express.Router();

Router.post('/create',protectRoute,create);
Router.post('/like/:id',protectRoute,like);
Router.get('/likedpost/:id',protectRoute,Likedposts);
Router.get('/getAll',protectRoute,Allposts);
Router.get('/userpost/:username',protectRoute,Userposts);
Router.post('/comment/:id',protectRoute,comment);
Router.delete('/:id',protectRoute,deletepost);
Router.get('/followingpost',protectRoute,getfollowingpost)

export default Router;