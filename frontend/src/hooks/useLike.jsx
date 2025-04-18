import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { url } from '../constant/url';
import toast from 'react-hot-toast';

const useLike = () => {

    const queryClient=useQueryClient();
    const {data,isPending,mutate:LikeunLike}=useMutation({
        mutationFn:async(post)=>{
            try{
                const res=await fetch(`${url}/post/like/${post._id}`,{
                    method:"POST",
                    credentials:'include',
                    headers:{
                        "Content-Type":"application/json"
                    },
                }
            )
            const data= await res.json();
            if(!res.ok){
                throw new Error(data.error||data.messege)
            }
            return data;
            }catch(e){
                throw e;
            }
        },
        onSuccess:()=>{
            toast.success("success");
            Promise.all([
                queryClient.invalidateQueries({queryKey:['posts']}),
                queryClient.invalidateQueries({queryKey:['authUser']})
            ]
            )


        },
        onError:()=>{
            toast.error("cant like")
        }
    })
    // followorunfollow(user)
    return {LikeunLike,isPending};

}

export default useLike;