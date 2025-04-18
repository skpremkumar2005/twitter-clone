import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { url } from '../constant/url';
import toast from 'react-hot-toast';

const useFollow = () => {

    const queryClient=useQueryClient();
    const {data,isPending,mutate:followorunfollow}=useMutation({
        mutationFn:async(user)=>{
            try{
                const res=await fetch(`${url}/user/follow/${user._id}`,{
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
                queryClient.invalidateQueries({queryKey:['suggesteduser']}),
            queryClient.invalidateQueries({queryKey:['authUser']})]
            )


        },
        onError:()=>{
            toast.error("cant follow")
        }
    })
    // followorunfollow(user)
    return {followorunfollow,isPending};

}

export default useFollow;