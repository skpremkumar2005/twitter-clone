import React, { useEffect } from 'react'
// import { useState } from 'react'
import {Route,Routes} from 'react-router-dom'

import './App.css'
import SignUpPage from './pages/auth/signup/SignUpPage';
import HomePage from'./pages/home/HomePage'
import LoginPage from './pages/auth/login/LoginPage';
import Sidebar from '../src/components/common/Sidebar'
import RightPanel from './components/common/RightPanel';
import ProfilePage from './pages/profile/ProfilePage';
import Notification from './pages/notification/NotificationPage'
import {Toaster} from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query';
import { url } from './constant/url';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
	useEffect(() => {
		if ('serviceWorker' in navigator) {
		  navigator.serviceWorker.register('/service-worker.js')
			.then(reg => console.log('✅ Service Worker registered', reg))
			.catch(err => console.error('❌ Service Worker registration failed:', err));
		}
	  }, []);
	const {data:authUser,isLoading}=useQuery({
		queryKey:["authUser"],
		queryFn:async()=>{
			try{
				const res= await fetch('https://twitter-lite-m10m.onrender.com/api/auth/me', {
					method: 'GET',
					credentials: 'include', // 🍪 required to send cookie
					headers: {
					  'Content-Type': 'application/json'
					}
				  });
				const data=await res.json();
				if(data.error){
					console.log(1)

					console.log(data)
					return null
				}
				if(!res.ok){
					throw new Error(data.error)
				}
				// console.log(data);
				return data;
			}catch(e){
             throw e;
			}
		},
		retry:false
		
	})
	const {data:recommentuser,isLoading:isLoad}=useQuery({
		queryKey:["suggesteduser"],
		queryFn:async()=>{
			try{
				const res= await fetch(`${url}/user/suggesion`,{
					method:"GET",
					credentials:"include",
					headers:{
						"Content-Type":"application/json"
					}
				})
				const data=await res.json();
				if(data.error){

					console.log(data)
					return null
				}
				if(!res.ok){
					throw new Error(data.error)
				}
				// console.log(data);
				return data;
			}catch(e){
             throw e;
			}
		},
		retry:false
		
	})
    if (isLoading){
		return <div className='flex justify-center items-center h-screen'>
			<LoadingSpinner size='lg'/>
		</div>
	}

	return (
		<div className='flex max-w-6xl mx-auto'>
			{authUser&&<Sidebar/>}
			<Routes>
				<Route path='/' element={authUser?<HomePage recommentuser={recommentuser} isLoading={isLoad} />:<LoginPage/>} />
				<Route path='/signup' element={!authUser?<SignUpPage />:<HomePage/>} />
				<Route path='/login' element={!authUser?<LoginPage />:<HomePage/>} />
				<Route path='/profile/:username' element={authUser?<ProfilePage/>:<LoginPage/>}/>
				<Route path='/notifications' element={authUser?<Notification/>:<LoginPage/>}/>
			</Routes>
			{authUser&&<RightPanel recommentuser={recommentuser} isLoading={isLoad}/>}
			<Toaster/>
		</div>
	);
}

export default App
