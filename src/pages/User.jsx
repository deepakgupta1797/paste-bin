import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "../redux/authSlice";
import BackButton from "../components/BackButton";
import { FiUser, FiImage, FiKey } from "react-icons/fi";
import toast from "react-hot-toast";

const User = () => {
	const dispatch = useDispatch();
	const currentUser = useSelector(selectCurrentUser);
	const [username, setUsername] = useState(currentUser?.username || "");
	const [profilePic, setProfilePic] = useState(currentUser?.profilePicUrl || "");
	const [passwords, setPasswords] = useState({
		current: "",
		new: "",
		confirm: "",
	});
	const [loading, setLoading] = useState(false);

	if (!currentUser) {
		return (
			<div className="container mx-auto px-4 py-8 text-center">
				<p>Loading user information or not logged in...</p>
			</div>
		);
	}

	// Handlers for updating user info
	const handleUsernameChange = async (e) => {
		e.preventDefault();
		setLoading(true);
		// Simulate API call
		setTimeout(() => {
			// dispatch(updateUsername(username)); // Uncomment if redux action exists
			toast.success("Username updated!");
			setLoading(false);
		}, 800);
	};

	const handleProfilePicChange = async (e) => {
		e.preventDefault();
		setLoading(true);
		// Simulate API call
		setTimeout(() => {
			// dispatch(updateProfilePic(profilePic)); // Uncomment if redux action exists
			toast.success("Profile picture updated!");
			setLoading(false);
		}, 800);
	};

	const handlePasswordChange = async (e) => {
		e.preventDefault();
		if (passwords.new !== passwords.confirm) {
			toast.error("New passwords do not match.");
			return;
		}
		setLoading(true);
		// Simulate API call
		setTimeout(() => {
			// dispatch(updatePassword(passwords)); // Uncomment if redux action exists
			toast.success("Password updated!");
			setLoading(false);
			setPasswords({ current: "", new: "", confirm: "" });
		}, 800);
	};

	return (
		<div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<div className="bg-white shadow-xl rounded-lg p-8">
					<BackButton />
					<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
						<FiUser /> My Profile
					</h1>
					<div className="space-y-4 mb-8">
						<div className="flex items-center gap-4">
							{profilePic ? (
								<img src={profilePic} alt="Profile" className="w-16 h-16 rounded-full object-cover border" />
							) : (
								<div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
									<FiUser className="text-3xl text-gray-400" />
								</div>
							)}
							<div>
								<p className="text-lg text-gray-700 font-semibold">{currentUser.name}</p>
								<p className="text-sm text-gray-500">{currentUser.emailid}</p>
								<p className="text-sm text-gray-500">Role: <span className="capitalize">{currentUser.role}</span></p>
							</div>
						</div>
					</div>

					{/* Username Change Form */}
					<form onSubmit={handleUsernameChange} className="mb-8">
						<label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
							<FiUser /> Change Username
						</label>
						<div className="flex gap-2">
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="p-2 border rounded w-full"
								minLength={3}
								required
							/>
							<button
								type="submit"
								className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1"
								disabled={loading}
							>
								Update
							</button>
						</div>
					</form>

					{/* Profile Pic Change Form */}
					<form onSubmit={handleProfilePicChange} className="mb-8">
						<label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
							<FiImage /> Change Profile Picture (URL)
						</label>
						<div className="flex gap-2">
							<input
								type="url"
								value={profilePic}
								onChange={(e) => setProfilePic(e.target.value)}
								className="p-2 border rounded w-full"
								placeholder="Paste image URL here"
								required
							/>
							<button
								type="submit"
								className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1"
								disabled={loading}
							>
								Update
							</button>
						</div>
					</form>

					{/* Password Change Form */}
					<form onSubmit={handlePasswordChange} className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
							<FiKey /> Change Password
						</label>
						<div className="space-y-2">
							<input
								type="password"
								value={passwords.current}
								onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
								className="p-2 border rounded w-full"
								placeholder="Current password"
								required
							/>
							<input
								type="password"
								value={passwords.new}
								onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
								className="p-2 border rounded w-full"
								placeholder="New password"
								minLength={6}
								required
							/>
							<input
								type="password"
								value={passwords.confirm}
								onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
								className="p-2 border rounded w-full"
								placeholder="Confirm new password"
								minLength={6}
								required
							/>
						</div>
						<button
							type="submit"
							className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1"
							disabled={loading}
						>
							Update
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default User;
