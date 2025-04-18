import React, { useEffect } from "react";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import { url } from "../../constant/url";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "./LoadingSpinner";

const Posts = ({feedType,user,recommentuser}) => {
	// const {data:suggesteduser,isPending}=useQuery({queryKey:["suggesteduser"]})
	// const isLoading = false;
	// console.log(recommentuser)
	const {followorunfollow,isPending}=useFollow();
	
    const getPostEndPoint=()=>{
		switch(feedType){
			case "foryou":
				return `${url}/post/getAll`;
			case "following":
				return `${url}/post/followingpost`;
			case "posts":
				return `${url}/post/userpost/${user.username}`;
			case "likes":
				return `${url}/post/likedpost/${user._id}`;
			default:
				return `${url}/post/getAll`;

		}
		
	}
	const POST_END_POINT=getPostEndPoint();
		// console.log(POST_END_POINT);
		const {data:posts,isLoading,refetch,isRefetching}=useQuery({
           queryKey:['posts'],
		   queryFn:async()=>{
			try{
				// console.log(1)
				const res=await fetch(POST_END_POINT,{
					method:"GET",
					credentials:'include',
					headers:{
						"Content-Type":"application/json",
						// "Accept":"application/json",
					},
				})
				const data=await res.json();
			  if(!res.ok){
				throw new Error(data.error);
			  }
			//   console.log(data);

			  return data;
			}catch(e){
				
				throw e;
			}
		   }
		   
		})
		useEffect(()=>{
			refetch();
		},[feedType,refetch]);
    //   posts();

	return (
		<>
			{isLoading && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
{recommentuser?.length > 0 && (
  <div className="lg:hidden bg-base-100 rounded-box shadow-md p-4">
    <h2 className="text-sm font-semibold mb-3 opacity-70">Recommended for you</h2>
    <div className="flex gap-4  pb-2  overflow-x-scroll scrollbar-hide whitespace-nowrap">
      {recommentuser.map((user) => (
        <div
          key={user._id}
          className="relative flex-shrink-0 w-36 rounded-box bg-base-200 p-3 shadow-md"
        >
          <img
            className="rounded-box w-full h-24 object-cover mb-2"
            src={user.image}
            alt={user.fullname}
          />
          <div className="text-sm font-medium text-center">{user.fullname}</div>
                                       <button
										className='btn  btn-primary mt-2 w-full hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {e.preventDefault();
											followorunfollow(user)
										}

										}
									>
									{isPending?<LoadingSpinner size="sm"/>:"Follow"}
									</button>        </div>
      ))}
    </div>
  </div>
)}

			{!isLoading && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;