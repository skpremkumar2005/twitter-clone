import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { url } from '../constant/url';
import toast from 'react-hot-toast';

const useComment = () => {

    const queryClient=useQueryClient();
    const {data,isPending,mutate:comments}=useMutation({
        mutationFn:async({post,comment})=>{
            try{
                const text=comment;
                // console.log(text)
                const res=await fetch(`${url}/post/comment/${post._id}`,{
                    method:"POST",
                    credentials:'include',
                    headers:{
                        "Content-Type":"application/json",
                        "Accept":"application/json",

                    },
                    body:JSON.stringify({text})
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
        queryClient.invalidateQueries({queryKey:['posts']})


        },
        onError:()=>{
            toast.error("cant like")
        }
    })
    // followorunfollow(user)
    return {comments,isPending};

}

export default useComment;