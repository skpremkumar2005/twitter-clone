import React from 'react'
import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, {Toaster} from 'react-hot-toast'
import { url } from "../../../constant/url";
import { FaUser } from 'react-icons/fa';

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		email:'',
		password: "",
	});
	const queryClient =  useQueryClient()
	const {isError,mutate:login,isPending,error} =useMutation({
		mutationFn:async({username,password,email})=>{
			try{
			  const res=await fetch(`${url}/api/auth/signin`,{
				method:"POST",
				credentials:"include",
				headers:{
					"Content-Type":"application/json",
					"Accept":"application/json",
				},
				body:JSON.stringify({username,password,email})
			  });
	
			  const data=await res.json();
			  if(!res.ok){
				throw new Error(data.error);
			  }
			 console.log(data);
		 return data; 
			}catch(e){
				console.log(e)
				throw e
			}
	
		},
		onSuccess:()=>{
			console.log("sucess")
			toast.success("Login succesfully")
			queryClient.invalidateQueries({
				queryKey:['authUser']
			})
		},
		onError:()=>{
			toast.error("something went wrong")
		}
	  });
	const handleSubmit = (e) => {
		e.preventDefault();
		login(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
					<FaUser />
						<input
							type='text'
							className='grow'
							placeholder='username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>{isPending?"Loading":"Login"}</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;