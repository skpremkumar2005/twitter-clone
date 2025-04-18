import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft, FaLink } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { url } from "../../constant/url";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const ProfilePage = () => {
	const { followorunfollow, isPending } = useFollow();

	const [coverImage, setCoverImg] = useState(null);
	const [image, setProfileImg] = useState(null);
	const [feedType, setFeedType] = useState("posts");

	const { username } = useParams();

	const coverImgRef = useRef(null);
	const profileImgRef = useRef(null);

	const queryClient = useQueryClient();

	const { data: auth } = useQuery({ queryKey: ["authUser"] });

	const {
		data: user,
		refetch,
		isLoading,
	} = useQuery({
		queryKey: ["userProfile", username],
		queryFn: async () => {
			try {
				const res = await fetch(`${url}/user/getProfile/${username}`, {
					method: "GET",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error);
				return data;
			} catch (e) {
				toast.error(e.message || "Failed to load user");
				return null;
			}
		},
	});

	const { mutate: edit } = useMutation({
		mutationFn: async (formData) => {
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
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
			queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
			setCoverImg(null);
			setProfileImg(null);
		},
		onError: (err) => {
			toast.error(err.message || "Could not update");
		},
	});

	useEffect(() => {
		refetch();
	}, [username, refetch]);

	const authUser = auth?.user;
	const isMyProfile = user && authUser && user.username === authUser.username;
	const isFollow = authUser?.followings.includes(user?._id);

	const handleImgChange = (e, type) => {
		const file = e.target.files[0];
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onload = () => {
				if (type === "coverImg") setCoverImg(reader.result);
				if (type === "profileImg") setProfileImg(reader.result);
			};
			reader.readAsDataURL(file);
		} else {
			toast.error("Please select a valid image file");
		}
	};

	const handleFollowToggle = () => {
		if (user) followorunfollow(user);
	};

	const handleUpdate = (e) => {
		e.preventDefault();
		edit({
			image: image || user?.image,
			coverImage: coverImage || user?.coverImage,
		});
	};

	const hasImageChanged = image || coverImage;

	return (
		<div className='flex-[4_4_0] border-r border-gray-700 min-h-screen'>
			{isLoading && <ProfileHeaderSkeleton />}
			{!isLoading && !user && (
				<p className='text-center text-lg mt-4'>User not found</p>
			)}
			{!isLoading && user && (
				<>
					<div className='flex gap-10 px-4 py-2 items-center'>
						<Link to='/'>
							<FaArrowLeft className='w-4 h-4' />
						</Link>
						<div className='flex flex-col'>
							<p className='font-bold text-lg'>{user.fullname}</p>
							<span className='text-sm text-slate-500'>{POSTS.length} posts</span>
						</div>
					</div>

					{/* Cover Image */}
					<div className='relative group/cover'>
						<img
							src={coverImage || user.coverImage || "/cover.png"}
							className='h-52 w-full object-cover'
							alt='cover'
						/>
						{isMyProfile && (
							<div
								className='absolute top-2 right-2 p-2 bg-gray-800 bg-opacity-75 rounded-full cursor-pointer hover:bg-opacity-90 transition duration-200'
								onClick={() => coverImgRef.current.click()}
							>
								<MdEdit className='w-5 h-5 text-white' />
							</div>
						)}
						<input
							type='file'
							hidden
							ref={coverImgRef}
							onChange={(e) => handleImgChange(e, "coverImg")}
						/>
						<input
							type='file'
							hidden
							ref={profileImgRef}
							onChange={(e) => handleImgChange(e, "profileImg")}
						/>
						<div className='avatar absolute -bottom-16 left-4'>
							<div className='w-32 rounded-full relative group/avatar'>
								<img
									src={image || user.image || "/avatar-placeholder.png"}
									alt='avatar'
								/>
								{isMyProfile && (
									<div className='absolute top-5 right-3 p-1 bg-primary rounded-full'>
										<MdEdit
											className='w-4 h-4 text-red-400 cursor-pointer'
											onClick={() => profileImgRef.current.click()}
										/>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Buttons */}
					<div className='flex justify-end px-4 mt-5'>
						{isMyProfile && <EditProfileModal />}
						{!isMyProfile && (
							<button
								className='btn btn-outline rounded-full btn-sm'
								onClick={handleFollowToggle}
							>
								{isPending ? <LoadingSpinner /> : isFollow ? "Following" : "Follow"}
							</button>
						)}
						{hasImageChanged && (
							<button
								className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
								onClick={handleUpdate}
							>
								Update
							</button>
						)}
					</div>

					{/* Profile Info */}
					<div className='flex flex-col gap-4 mt-14 px-4'>
						<div className='flex flex-col'>
							<span className='font-bold text-lg'>{user.fullname}</span>
							<span className='text-sm text-slate-500'>@{user.username}</span>
							<span className='text-sm my-1'>{user.bio}</span>
						</div>

						<div className='flex gap-2 flex-wrap'>
							{user.link && (
								<div className='flex gap-1 items-center'>
									<FaLink className='w-3 h-3 text-slate-500' />
									<a
										href={user.link}
										target='_blank'
										rel='noreferrer'
										className='text-sm text-blue-500 hover:underline'
									>
										{user.link}
									</a>
								</div>
							)}
							<div className='flex gap-2 items-center'>
								<IoCalendarOutline className='w-4 h-4 text-slate-500' />
								<span className='text-sm text-slate-500'>
									Joined{" "}
									{new Date(user.CreatedAt).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
									})}
								</span>
							</div>
						</div>

						<div className='flex gap-2'>
							<div className='flex gap-1 items-center'>
								<span className='font-bold text-xs'>{user.followings.length}</span>
								<span className='text-slate-500 text-xs'>Following</span>
							</div>
							<div className='flex gap-1 items-center'>
								<span className='font-bold text-xs'>{user.followers.length}</span>
								<span className='text-slate-500 text-xs'>Followers</span>
							</div>
						</div>
					</div>

  

  
					{/* Tabs */}
					<div className='flex w-full border-b border-gray-700 mt-4'>
						<div
							className={`flex justify-center flex-1 p-3 cursor-pointer hover:bg-secondary transition duration-300 relative ${
								feedType === "posts" ? "text-white" : "text-slate-500"
							}`}
							onClick={() => setFeedType("posts")}
						>
							Posts
							{feedType === "posts" && (
								<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
							)}
						</div>
						<div
							className={`flex justify-center flex-1 p-3 cursor-pointer hover:bg-secondary transition duration-300 relative ${
								feedType === "likes" ? "text-white" : "text-slate-500"
							}`}
							onClick={() => setFeedType("likes")}
						>
							Likes
							{feedType === "likes" && (
								<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
							)}
						</div>
					</div>

					<Posts feedType={feedType} user={user} />
				</>
			)}
		</div>
	);
};

export default ProfilePage;
