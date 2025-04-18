import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { url } from '../constant/url';
import toast from 'react-hot-toast';

const useEdit = () => {
	const queryClient = useQueryClient();

	const { isPending, mutate: edit } = useMutation({
		mutationFn: async (formData) => {
			try {
				const res = await fetch(`${url}/user/updateprofile`, {
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error);
				return data;
			} catch (e) {
				throw e;
			}
		},
		onSuccess: () => {
			toast.success("Updated successfully");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (err) => {
			toast.error(err.message || "Could not update");
		},
	});

	return { edit, isPending };
};

export default useEdit;
